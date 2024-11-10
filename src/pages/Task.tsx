import { useParams } from "react-router-dom";

const Task = () => {
  const { id } = useParams();

  if (!id) {
    return (
      <div>
        <p>Task not found</p>
      </div>
    );
  }
  return <div>Task</div>;
};

export default Task;
