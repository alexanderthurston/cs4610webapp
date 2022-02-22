import { Task } from './task';

export const Tasks = ({
  tasks,
  setIncompleteTasks,
  setDoneTasks,
  allTasks,
  doneTasks,
  incompleteTasks,
  deleteTask,
  user,
}) => {
  return (
    <div className="flex-auto">
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          setIncompleteTasks={setIncompleteTasks}
          setDoneTasks={setDoneTasks}
          allTasks={allTasks}
          doneTasks={doneTasks}
          incompleteTasks={incompleteTasks}
          deleteTask={deleteTask}
          user={user}
        />
      ))}
    </div>
  );
};
