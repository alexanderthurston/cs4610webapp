import { useContext } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { BlueButton } from '../common/blue_button';
import { RedButton } from '../common/red_button';

export const Task = ({ task, setIncompleteTasks, setDoneTasks, allTasks, deleteTask, user }) => {
  const api = useContext(ApiContext);

  const updateTaskStatus = async (newStatus) => {
    // task.status = newStatus;
    const taskBody = {
      userId: task.userId,
      title: task.title,
      description: task.description,
      timeEstimation: task.timeEstimation,
      status: newStatus,
      projectId: task.projectId,
    };
    const { updatedTask } = await api.put(`/projects/${task.projectId}/tasks/${task.id}`, taskBody);

    setDoneTasks(allTasks.filter((e) => e.status === 'Done'));
    setIncompleteTasks(allTasks.filter((e) => e.status === 'Incomplete'));
  };

  const updateTaskAssignment = async (newUserId) => {
    task.userId = newUserId;
    const taskBody = {
      userId: newUserId,
      title: task.title,
      description: task.description,
      timeEstimation: task.timeEstimation,
      status: task.status,
      projectId: task.projectId,
    };
    const { updatedTask } = await api.put(`/projects/${task.projectId}/tasks/${task.id}`, taskBody);

    setDoneTasks(allTasks.filter((e) => e.status === 'Done'));
    setIncompleteTasks(allTasks.filter((e) => e.status === 'Incomplete'));
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
