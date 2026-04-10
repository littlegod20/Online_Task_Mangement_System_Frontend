import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2, LogOut, Plus } from "lucide-react";
import Button from "../../components/common/Button";
import TaskCard from "../../components/TaskCard";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { taskData, taskForm } from "../../utils/constants";
import { handleInputChange } from "../../utils/form";
import { isFormDataComplete } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
  fetchTasks,
  postTaskData,
  resetFetchTaskStatus,
} from "../../state/slices/taskSlice";
import Select from "../../components/Select";
import { useNavigate } from "react-router-dom";
import { logout } from "../../state/slices/authSlice";

export interface TaskProps {
  title: string;
  description: string;
  date: Date;
  status: "pending" | "in-progress" | "completed";
  id?: string;
}

const STATUS_ORDER: TaskProps["status"][] = [
  "pending",
  "in-progress",
  "completed",
];

const COLUMN_LABELS: Record<TaskProps["status"], string> = {
  pending: "Pending",
  "in-progress": "In progress",
  completed: "Completed",
};

const VALID_STATUSES: TaskProps["status"][] = [
  "pending",
  "in-progress",
  "completed",
];

function normalizeTaskStatus(value: unknown): TaskProps["status"] {
  const s = String(value);
  if (VALID_STATUSES.includes(s as TaskProps["status"])) {
    return s as TaskProps["status"];
  }
  return "pending";
}

function getFetchErrorMessage(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return "Something went wrong while loading tasks.";
}

const Home = () => {
  const navigate = useNavigate();
  const [taskFormData, setTaskFormData] = useState<TaskProps>(taskData);
  const [isClicked, setIsClicked] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { status, tasks, fetchStatus, fetchError } = useSelector(
    (state: RootState) => state.task
  );
  const { role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskProps["status"], TaskProps[]> = {
      pending: [],
      "in-progress": [],
      completed: [],
    };
    for (const item of tasks) {
      const st = normalizeTaskStatus(item.status);
      groups[st].push(item);
    }
    return groups;
  }, [tasks]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(taskFormData);
      if (isFormDataComplete(taskFormData)) {
        const response = await dispatch(postTaskData(taskFormData));
        console.log("response Payload:", response);

        await dispatch(fetchTasks());

        setTaskFormData(taskData);
        setIsClicked(false);
        return response.payload;
      } else {
        console.log("please fill in details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (fetchStatus === "succeeded") {
      setTaskFormData(taskData);
    }
    console.log("reseting fetch task status");
    dispatch(resetFetchTaskStatus());

    console.log("fetching tasks");
    dispatch(fetchTasks())
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTaskClick = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const isInitialLoading =
    (fetchStatus === "loading" || fetchStatus === "idle") &&
    tasks.length === 0;

  const showError = fetchStatus === "failed";
  const showEmpty = fetchStatus === "succeeded" && tasks.length === 0;
  const showBoard = !showError && !isInitialLoading && !showEmpty;

  const errorMessage = getFetchErrorMessage(fetchError);

  return (
    <main className="w-full">
      <section className="p-5">
        <div className="flex justify-between">
          <div className="shrink-0">
            {role === "user" && tasks.length > 0 ? (
              <Button
                title="Add Task"
                icon={Plus}
                onClick={() => setIsClicked(!isClicked)}
                className="!w-auto rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
              />
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <Button
              title="Logout"
              icon={LogOut}
              onClick={() => setIsLogoutModalOpen(true)}
              className="!w-auto rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
            />
          </div>
        </div>
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="Logout"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-700">
              Are you sure you want to log out?
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={isClicked}
          onClose={() => setIsClicked(false)}
          title="Add Task"
        >
          <section>
            <form className="space-y-3 bg-white w-full" onSubmit={handleSubmit}>
              {taskForm.map((item, index) => (
                <Input
                  key={index}
                  name={item.label}
                  placeholder={item.placeholder}
                  value={taskFormData[item.label as keyof TaskProps]}
                  onChange={(e) => handleInputChange(e, setTaskFormData)}
                  type={item.type}
                />
              ))}

              <Select setTaskFormData={setTaskFormData} />
              <Button
                type="submit"
                title="Submit"
                disabled={status === "loading"}
                loadingTitle="Submitting..."
              />
            </form>
          </section>
        </Modal>
      </section>

      <section className="w-full">
        {showError && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50/90 p-8 text-center">
            <p className="text-sm text-red-900">{errorMessage}</p>
            <button
              type="button"
              className="rounded-lg border border-red-900 bg-red-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800"
              onClick={() => dispatch(fetchTasks())}
            >
              Try again
            </button>
          </div>
        )}

        {isInitialLoading && !showError && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
            <Loader2
              className="h-9 w-9 animate-spin text-slate-400"
              aria-hidden
            />
            <p className="text-sm">Loading tasks…</p>
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center gap-4 px-5 py-20 text-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-400">
              <ClipboardList className="h-10 w-10" strokeWidth={1.5} />
            </div>
            <div className="max-w-sm space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">
                No tasks yet
              </h2>
              <p className="text-sm text-slate-600">
                {role === "user"
                  ? "Create your first task to get started."
                  : "There are no tasks to show right now."}
              </p>
            </div>
            {role === "user" ? (
              <Button
                title="Add task"
                icon={Plus}
                onClick={() => setIsClicked(true)}
                className="!w-auto rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm"
              />
            ) : null}
          </div>
        )}

        {showBoard && (
          <>
            {fetchStatus === "loading" && tasks.length > 0 ? (
              <p className="pb-2 text-center text-sm text-slate-500">
                Updating tasks…
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-3">
              {STATUS_ORDER.map((columnStatus) => (
                <div
                  key={columnStatus}
                  className="flex flex-col rounded-xl border border-slate-200/90 bg-slate-50/60 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200/90 pb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                      {COLUMN_LABELS[columnStatus]}
                    </h2>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-medium tabular-nums text-slate-600 ring-1 ring-slate-200/80">
                      {tasksByStatus[columnStatus].length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {tasksByStatus[columnStatus].map((item, index) => (
                      <TaskCard
                        key={item.id ?? `${columnStatus}-${index}`}
                        task={{
                          title: item.title,
                          description: item.description,
                          date: item.date,
                          status: item.status,
                          id: item.id,
                        }}
                        onClick={
                          item.id != null
                            ? () => handleTaskClick(item.id!)
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
