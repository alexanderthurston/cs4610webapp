import { useContext } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { BlueButton } from '../common/blue_button';
import { RedButton } from '../common/red_button';

export const Task = ({
  task,
  setIncompleteTasks,
  setDoneTasks,
  allTasks,
  doneTasks,
  incompleteTasks,
  deleteTask,
  user,
}) => {
  const api = useContext(ApiContext);

  const updateTaskStatus = async (newStatus) => {
    // task.status = newStatus;
    const taskBody = {
      // userId: task.userId,
      // title: task.title,
      // description: task.description,
      // timeEstimation: task.timeEstimation,
      status: newStatus,
      // projectId: task.projectId,
    };
    const { updatedTask } = await api.put(`/projects/${task.projectId}/tasks/${task.id}`, taskBody);
    
    console.log(`Updated task: ${updatedTask}`);

    if (newStatus === 'Done') {
      setDoneTasks([updatedTask, ...doneTasks.filter((e) => e !== task)]);
      setIncompleteTasks(incompleteTasks.filter((e) => e !== task));
    } else {
      setDoneTasks(doneTasks.filter((e) => e !== task));
      setIncompleteTasks([updatedTask, ...incompleteTasks.filter((e) => e !== task)]);
    }
  };

  const updateTaskAssignment = async (newUserId) => {
    // task.userId = newUserId;
    console.log(`User id: ${user.id}`);
    const taskBody = {
      userId: newUserId,
      // title: task.title,
      // description: task.description,
      // timeEstimation: task.timeEstimation,
      // status: task.status,
      // projectId: task.projectId,
    };
    const { updatedTask } = await api.put(`/projects/${task.projectId}/tasks/${task.id}`, taskBody);

    if (updatedTask.status === 'Done') {
      setDoneTasks([updatedTask, ...doneTasks.filter((e) => e !== task)]);
      setIncompleteTasks(incompleteTasks.filter((e) => e !== task));
    } else {
      setDoneTasks(doneTasks.filter((e) => e !== task));
      setIncompleteTasks([updatedTask, ...incompleteTasks.filter((e) => e !== task)]);
    }
  };

  return (
    <div className="flex-col w-fit p-4 m-4 rp-10 border-2 rounded-md">
      <strong className="break-words">{task.title}</strong>
      <p className="break-words">{task.description}</p>
      <p>Time: {task.timeEstimation}</p>
      <p>Status: {task.status}</p>
      {task.userId && <p>Assignee Email: {task.user.email}</p>}
      <div className="py-2">
        <RedButton onClick={() => deleteTask(task)}>Delete</RedButton>
        <Button onClick={() => updateTaskAssignment(user.id)}>Assign to me</Button>
        {task.status === 'Incomplete' ? (
          <BlueButton onClick={() => updateTaskStatus('Done')}>Mark Done</BlueButton>
        ) : (
          <BlueButton onClick={() => updateTaskStatus('Incomplete')}>Mark Incomplete</BlueButton>
        )}
      </div>
    </div>
  );
};
