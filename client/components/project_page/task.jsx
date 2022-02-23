import { useContext } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { BlueButton } from '../common/blue_button';
import { RedButton } from '../common/red_button';
import { ProjectMemberSelect } from './project_member_select';

export const Task = ({
  task,
  setIncompleteTasks,
  setDoneTasks,
  doneTasks,
  incompleteTasks,
  deleteTask,
  user,
  projectMembers,
}) => {
  const api = useContext(ApiContext);

  const updateTaskStatus = async (newStatus) => {
    const taskBody = {
      status: newStatus,
    };
    const { updatedTask } = await api.put(`/projects/${task.projectId}/tasks/${task.id}`, taskBody);

    if (newStatus === 'Done') {
      setDoneTasks([updatedTask, ...doneTasks.filter((e) => e !== task)]);
      setIncompleteTasks(incompleteTasks.filter((e) => e !== task));
    } else {
      setDoneTasks(doneTasks.filter((e) => e !== task));
      setIncompleteTasks([updatedTask, ...incompleteTasks.filter((e) => e !== task)]);
    }
  };

  const updateTaskAssignment = async (newUserId) => {
    const taskBody = {
      userId: newUserId,
    };
    const { updatedTask } = await api.put(`/projects/${task.projectId}/tasks/${task.id}`, taskBody);
    console.log(updatedTask);
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
      {task.project.leaderId == user.id && (
        <ProjectMemberSelect
          projectMembers={projectMembers}
          updateTaskAssignment={updateTaskAssignment}
        ></ProjectMemberSelect>
      )}
      <div className="py-2">
        <RedButton onClick={() => deleteTask(task)}>Delete</RedButton>
        <Button onClick={() => updateTaskAssignment(user.id)}>Assign to me</Button>
        {task.status === 'Incomplete'
          ? task.userId === user.id && <BlueButton onClick={() => updateTaskStatus('Done')}>Mark Done</BlueButton>
          : task.userId === user.id && (
              <BlueButton onClick={() => updateTaskStatus('Incomplete')}>Mark Incomplete</BlueButton>
            )}
      </div>
    </div>
  );
};
