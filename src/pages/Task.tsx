import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../state/store";
import { fetchATask } from "../state/slices/taskSlice";
import { useEffect } from "react";
import TaskCard from "../components/TaskCard";

const Task = () => {
  const { id } = useParams();
  const { task } = useSelector((state: RootState) => state.task);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) {
      // Fetch task data by ID when the component mounts or when the id changes
      dispatch(fetchATask(id));
    }
  }, [dispatch, id]);


  if (!id) {
    return (
      <div>
        <p>Task not found</p>
      </div>
    );
  }
  return (
    <div>
      {task ? (
        <>
          <div className="w-full flex justify-center items-center min-h-screen">
            <TaskCard task={task} />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p>Admins can't view single task</p>
        </div>
      )}
    </div>
  );
};

export default Task;
