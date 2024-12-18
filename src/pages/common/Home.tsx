import { useEffect, useState } from "react";
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

export interface TaskProps {
  title: string;
  description: string;
  date: Date;
  status: "pending" | "in-progress" | "completed";
  id?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [taskFormData, setTaskFormData] = useState<TaskProps>(taskData);
  const [isClicked, setIsClicked] = useState(false);

  const { status, tasks, fetchStatus } = useSelector(
    (state: RootState) => state.task
  );
  const { role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(taskFormData);
      if (isFormDataComplete(taskFormData)) {
        const response = await dispatch(postTaskData(taskFormData));
        console.log("response Payload:", response);

        // after task data submission, refresh the task list
        await dispatch(fetchTasks());

        // then reset the form fields
        setTaskFormData(taskData);
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
    // resetting the redux status after successfull fetching
    console.log("reseting fetch task status");
    dispatch(resetFetchTaskStatus());

    // fetching tasks
    console.log("fetching tasks");
    dispatch(fetchTasks())
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTaskClick = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <main className="w-full">
      <section className="p-5">
        <div className="flex justify-between">
          <div className="w-16">
            {role === "user" ? (
              <Button title="+" onClick={() => setIsClicked(!isClicked)} />
            ) : null}
          </div>

          <div className="flex justify-center items-center"></div>
        </div>
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
                title="Submit"
                disabled={status === "loading"}
                loadingTitle="Submitting..."
              />
            </form>
          </section>
        </Modal>
      </section>
      <section className="w-full">
        <div className="flex flex-wrap gap-5 items-start w-full p-5">
          {tasks.map((item, index) => (
            <TaskCard
              task={{
                title: item.title,
                description: item.description,
                date: item.date,
                status: item.status,
                id: item.id,
              }}
              onClick={() => handleTaskClick(item.id!)}
              key={index}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
