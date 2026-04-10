import { Calendar, Edit, Save, Trash } from "lucide-react";
import { useState } from "react";
import Input from "./common/Input";
import Select from "./Select";
import { TaskProps } from "../pages/common/Home";
import { handleInputChange } from "../utils/form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state/store";
import { deleteTask, fetchTasks, updateTask } from "../state/slices/taskSlice";

interface CardProps {
  task: TaskProps;
  onClick?: () => void;
}

const statusStyles: Record<TaskProps["status"], string> = {
  pending:
    "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/80",
  "in-progress":
    "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200/80",
  completed:
    "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200/80",
};

function formatTaskDate(d: Date) {
  try {
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return String(d).slice(0, 10);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(d).slice(0, 10);
  }
}

const TaskCard: React.FC<CardProps> = ({ task, onClick }) => {
  const [isEditing, setIsEditting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [taskData, setTaskData] = useState<TaskProps>({
    ...task,
    date: new Date(task.date),
  });

  const handleSave = async (id: string) => {
    try {
      const response = await dispatch(updateTask({ taskData, id }));
      setIsEditting(false);
      dispatch(fetchTasks());
      console.log("saved");
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await dispatch(deleteTask(id));
      setIsEditting(false);
      dispatch(fetchTasks());
      console.log("deleted");
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const taskId = task.id ?? "1";
  const dueDate = new Date(task.date);
  const dueDateIso =
    Number.isNaN(dueDate.getTime()) ? undefined : dueDate.toISOString().slice(0, 10);

  return (
    <section
      className="group flex min-w-[280px] w-[340px] max-w-md flex-col rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
      role="article"
      aria-label={task.title}
    >
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-row items-start justify-between gap-2">
          {isEditing ? (
            <div className="min-w-0 flex-1">
              <Input
                placeholder={task.title}
                type="text"
                name="title"
                value={taskData.title}
                onChange={(e) => handleInputChange(e, setTaskData)}
              />
            </div>
          ) : (
            <header
              className="min-w-0 flex-1 cursor-pointer text-lg font-semibold leading-snug tracking-tight text-slate-900 transition-colors hover:text-slate-700"
              onClick={onClick}
            >
              <span className="line-clamp-2 capitalize">{task.title}</span>
            </header>
          )}
          <div className="flex shrink-0 gap-0.5 rounded-lg bg-slate-100/90 p-0.5">
            <button
              type="button"
              className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-white hover:text-slate-900 hover:shadow-sm"
              title={isEditing ? "Save" : "Edit"}
              onClick={
                isEditing
                  ? () => handleSave(taskId)
                  : () => setIsEditting(!isEditing)
              }
            >
              {isEditing ? (
                <Save size={18} strokeWidth={2} />
              ) : (
                <Edit size={18} strokeWidth={2} />
              )}
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
              title="Delete"
              onClick={() => handleDelete(taskId)}
            >
              <Trash size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        {isEditing ? (
          <Input
            placeholder={task.description}
            type="text"
            name="description"
            value={taskData.description}
            onChange={(e) => handleInputChange(e, setTaskData)}
          />
        ) : (
          <p className="line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-slate-600">
            {task.description || (
              <span className="italic text-slate-400">No description</span>
            )}
          </p>
        )}
      </div>

      <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
        {isEditing ? (
          <>
            <div className="flex w-1/2 min-w-[120px] items-end">
              <Select setTaskFormData={setTaskData} />
            </div>
            <div className="w-1/2 min-w-[120px]">
              <Input
                placeholder={task.date.toString().slice(0, 10)}
                type="date"
                name="date"
                value={taskData.date}
                onChange={(e) => handleInputChange(e, setTaskData)}
              />
            </div>
          </>
        ) : (
          <>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[task.status]}`}
            >
              {task.status.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar
                size={15}
                className="shrink-0 text-slate-400"
                strokeWidth={2}
                aria-hidden
              />
              <time dateTime={dueDateIso}>
                {formatTaskDate(dueDate)}
              </time>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TaskCard;
