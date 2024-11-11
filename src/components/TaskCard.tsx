import { Edit, Save, Trash } from "lucide-react";
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

  return (
    <section className="flex flex-col min-w-80 w-[350px] max-w-96 border p-3 justify-center items-center space-y-3 rounded-lg shadow-md shadow-slate-500 ">
      <>
        <div className="flex flex-col w-full space-y-3">
          <div className="flex flex-row justify-between items-start">
            {isEditing ? (
              <Input
                placeholder={task.title}
                type="text"
                name="title"
                value={taskData.title}
                onChange={(e) => handleInputChange(e, setTaskData)}
              />
            ) : (
              <header
                className="font-bold capitalize text-red-900 hover:cursor-pointer"
                onClick={onClick}
              >
                {task.title}
              </header>
            )}
            <div className="flex">
              <button
                className="p-1 hover:bg-gray-300 rounded-full transition-colors"
                onClick={
                  isEditing
                    ? () => handleSave(task.id ? task.id : "1")
                    : () => setIsEditting(!isEditing)
                }
              >
                {isEditing ? (
                  <Save size={20} color="gray" />
                ) : (
                  <Edit size={20} color="gray" />
                )}
              </button>
              <button className="p-1 hover:bg-gray-300 rounded-full transition-colors">
                <Trash
                  size={20}
                  color="gray"
                  onClick={() => handleDelete(task.id ? task.id : "1")}
                />
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
            <p className="text-xs text-slate-500 italic w-full break-words ">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex justify-between w-full">
          {isEditing ? (
            <>
              <div className="flex items-end w-1/2">
                <Select setTaskFormData={setTaskData} />
              </div>
              <div className="w-1/2">
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
              <p
                className={`text-xs py-1 px-2 font-bold text-slate-950  ${
                  task.status === "pending"
                    ? "bg-sky-600"
                    : task.status === "in-progress"
                    ? "bg-yellow-500"
                    : task.status === "completed"
                    ? "bg-emerald-600"
                    : ""
                } rounded-full opacity-80`}
              >
                {task.status}
              </p>
              <p className="text-sm text-slate-500 italic">
                {task.date.toString().slice(0, 10)}
              </p>
            </>
          )}
        </div>
      </>
    </section>
  );
};

export default TaskCard;
