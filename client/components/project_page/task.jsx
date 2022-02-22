import { useContext } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { BlueButton } from '../common/blue_button';
import { RedButton } from '../common/red_button';

export const Task = ({ task, setIncompleteTasks, setDoneTasks, allTasks }) => {
  const api = useContext(ApiContext);

  const updateTask = async (newStatus) => {
    task.status = newStatus;
    const taskBody = {
      // id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      timeEstimation: task.timeEstimation,
      status: newStatus,
      projectId: task.projectId,
    };
    // console.log(`/projects/${task.projectId}/tasks`);
    const { updatedTask } = await api.put(`/projects/${task.projectId}/tasks/${task.id}`, taskBody);

    setDoneTasks(allTasks.filter((e) => e.status === 'Done'));
    setIncompleteTasks(allTasks.filter((e) => e.status === 'Incomplete'));
  };

  // console.log('Beginning of Task');
  // console.log(tasks);
  return (
    <div className="flex-col w-fit p-4 m-4 rp-10 border-2 rounded-md">
      <strong className="break-words">{task.title}</strong>
      <p className="break-words">{task.description}</p>
      <p>Time: {task.timeEstimation}</p>
      <p>Status: {task.status}</p>
      <div className="py-2">
        <RedButton onClick={() => console.log('Delete stub')}>Delete</RedButton>
        <Button onClick={() => console.log('Assign to me!')}>Assign to me</Button>
        {task.status === 'Incomplete' ? (
          <BlueButton onClick={() => updateTask('Done')}>Mark Done</BlueButton>
        ) : (
          <BlueButton onClick={() => updateTask('Incomplete')}>Mark Incomplete</BlueButton>
        )}
      </div>
    </div>
  );
};
