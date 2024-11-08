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
import { postTaskData } from "../../state/slices/taskSlice";
import Select from "../../components/Select";

export interface TaskProps {
  title: string;
  description: string;
  date: Date;
  status: "pending" | "in-progress" | "completed";
}

const Home = () => {
  const [taskFormData, setTaskFormData] = useState<TaskProps>(taskData);
  const [isClicked, setIsClicked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.task);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(taskFormData);
      if (isFormDataComplete(taskFormData)) {
        const response = await dispatch(postTaskData(taskFormData));
        console.log("response Payload:", response);
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
    console.log("error:", error);
    console.log("status:", status);
  });

  return (
    <main>
      <section className="p-5">
        <div className="w-16">
          <Button title="+" onClick={()=> setIsClicked(!isClicked)} />
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
              <Button title="Submit" disabled={status === 'loading'} loadingTitle="Submitting..." />
            </form>
          </section>
        </Modal>
      </section>
      <section>
        <div>
          <TaskCard
            title="title"
            description="description"
            date={new Date()}
            status="completed"
          />
        </div>
      </section>
    </main>
  );
};

export default Home;
