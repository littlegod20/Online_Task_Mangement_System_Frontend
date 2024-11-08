import { TaskProps } from "../pages/common/Home";

interface SelectProps {
  setTaskFormData: React.Dispatch<React.SetStateAction<TaskProps>>;
}

const Select: React.FC<SelectProps> = ({ setTaskFormData }) => {
  return (
    <>
      <select
        className="p-2 rounded-md"
        onChange={(e) =>
          setTaskFormData((prevData) => ({
            ...prevData,
            status: e.target.value as "pending" | "in-progress" | "completed",
          }))
        }
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In-progress</option>
        <option value="completed">Completed</option>
      </select>
    </>
  );
};

export default Select;
