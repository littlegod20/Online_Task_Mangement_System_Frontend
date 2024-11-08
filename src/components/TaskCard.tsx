import { Edit } from "lucide-react";
import { useState } from "react";
import Input from "./common/Input";

interface CardProps {
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

const TaskCard: React.FC<CardProps> = ({
  title,
  description,
  status,
  dueDate,
}) => {
  const [isEditing, setIsEditting] = useState(false);
  return (
    <section className="flex flex-col min-w-80 w-[350px] max-w-96 border p-3 justify-center items-center space-y-3 rounded-lg shadow-md shadow-slate-500">
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <header className="font-bold capitalize text-red-900">{title}</header>
          <button
            className="p-1 hover:bg-gray-300 rounded-full transition-colors"
            onClick={() => setIsEditting(!isEditing)}
          >
            <Edit size={20} color="gray" />
          </button>
        </div>
        {isEditing ? (
          <Input
            placeholder={description}
            type="text"
            name="description"
            onChange={() => console.log("ho")}
          />
        ) : (
          <p className="text-xs text-slate-500 italic w-full break-words ">
            {description}
          </p>
        )}
      </div>
      <div className="flex justify-between w-full">
        <p>{status}</p>
        <p className="text-sm text-slate-500 italic">{dueDate}</p>
      </div>
    </section>
  );
};

export default TaskCard;

// title: string (task title)
// description: string
// status: enum ("pending", "in-progress", "completed")
// dueDate: timestamp
