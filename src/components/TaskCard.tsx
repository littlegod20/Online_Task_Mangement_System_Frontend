import { Edit, Save, Trash } from "lucide-react";
import { SetStateAction, useState } from "react";
import Input from "./common/Input";
import Select from "./Select";
import { TaskProps } from "../pages/common/Home";

interface CardProps {
  title: string;
  description: string;
  status: string;
  date: Date;
}

const TaskCard: React.FC<CardProps> = ({
  title,
  description,
  status,
  date,
}) => {
  const [isEditing, setIsEditting] = useState(false);
  return (
    <section className="flex flex-col min-w-80 w-[350px] max-w-96 border p-3 justify-center items-center space-y-3 rounded-lg shadow-md shadow-slate-500">
      <div className="flex flex-col w-full space-y-3">
        <div className="flex flex-row justify-between items-start">
          {isEditing ? (
            <Input
              placeholder={title}
              type="text"
              name="title"
              value={title}
              onChange={() => console.log("ho")}
            />
          ) : (
            <header className="font-bold capitalize text-red-900">
              {title}
            </header>
          )}
          <div className="flex">
            <button
              className="p-1 hover:bg-gray-300 rounded-full transition-colors"
              onClick={() => setIsEditting(!isEditing)}
            >
              {isEditing ? (
                <Save
                  size={20}
                  color="gray"
                  onClick={() => console.log("saved!")}
                />
              ) : (
                <Edit size={20} color="gray" />
              )}
            </button>
            <button className="p-1 hover:bg-gray-300 rounded-full transition-colors">
              <Trash size={20} color="gray" />
            </button>
          </div>
        </div>
        {isEditing ? (
          <Input
            placeholder={description}
            type="text"
            name="description"
            value={description}
            onChange={() => console.log("ho")}
          />
        ) : (
          <p className="text-xs text-slate-500 italic w-full break-words ">
            {description}
          </p>
        )}
      </div>
      <div className="flex justify-between w-full">
        {isEditing ? (
          <>
            <div className="flex items-end w-1/2">
              <Select
                setTaskFormData={function (
                  value: SetStateAction<TaskProps>
                ): void {
                  console.log(value);
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
            <div className="w-1/2">
              <Input
                placeholder={date.toString().slice(0, 10)}
                type="date"
                name="date"
                value={new Date(date)}
                onChange={() => console.log("ho")}
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-xs py-1 px-2 font-bold bg-slate-400 rounded-full opacity-80">
              {status}
            </p>
            <p className="text-sm text-slate-500 italic">
              {date.toString().slice(0, 10)}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default TaskCard;
