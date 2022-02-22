import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { AuthContext } from '../../utils/auth_context';
import { RolesContext } from '../../utils/roles_context';
import { BlueButtonBig } from '../common/blue_button_big';
import { PageHeader } from '../common/page_header';
import { Tasks } from './tasks';
import { useParams } from 'react-router-dom';

export const ProjectHome = () => {
  const [, setAuthToken] = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskEstimation, setTaskEstimation] = useState('');
  const [showCreateTaskMenu, setShowCreateTaskMenu] = useState(false);
  const [doneTasks, setDoneTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);

  const api = useContext(ApiContext);
  const roles = useContext(RolesContext);
  const params = useParams();
  const [user, setUser] = useState(null);

  useEffect(async () => {
    const res = await api.get('/users/me');
    setUser(res.user);
    const { tasks } = await api.get(`/projects/${params.id}/tasks`);

    // setTasks(tasks);
    setDoneTasks(tasks.filter((task) => task.status === 'Done'));
    setIncompleteTasks(tasks.filter((task) => task.status === 'Incomplete'));
  }, []);

  const saveTask = async () => {
    const taskBody = {
      title: taskTitle,
      description: taskDescription,
      timeEstimation: taskEstimation,
      status: 'Incomplete',
      projectId: params.id,
    };
    const { task } = await api.post(`/projects/${params.id}/tasks`, taskBody);
    // setTasks([task, ...tasks]);
    setIncompleteTasks([task, ...incompleteTasks]);
    setTaskTitle('');
    setTaskDescription('');
    setTaskEstimation('');
    setShowCreateTaskMenu(false);
  };

  const deleteTask = async (task) => {
    const { success } = await api.del(`projects/${params.id}/tasks/${task.id}`);
    if (success) {
      // setTasks(tasks.filter((t) => t !== task));
      setDoneTasks(doneTasks.filter((t) => t !== task));
      setIncompleteTasks(incompleteTasks.filter((t) => t !== task));
    } else {
      console.log('Delete failed');
    }
  };


  console.log(doneTasks);
  console.log(incompleteTasks);

  return (
    <div>
      <PageHeader />

      <div className="relative inline-block text-left m-5 ">
        <div>
          <BlueButtonBig type="button" onClick={() => setShowCreateTaskMenu(!showCreateTaskMenu)}>
            {showCreateTaskMenu ? 'Hide' : 'Create New Task'}
          </BlueButtonBig>
        </div>
        {showCreateTaskMenu && (
          <div className="origin-top-right right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-5">
              <span className="text-md font-medium text-slate-700">
                <strong>Title: </strong>
              </span>
              <input
                className="px-3 py-2 mb-5 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 w-full rounded-md sm:text-sm focus:ring-1"
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <span className="text-md mt-5 font-medium text-slate-700">
                <strong>Description: </strong>
              </span>
              <textarea
                className="px-3 py-2 mt-1 mb-5 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 w-full rounded-md sm:text-sm focus:ring-1"
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <span className="text-md mt-5 mr-5 font-medium text-slate-700">
                <strong>Time Estimation: </strong>
              </span>
              <input
                className="mt-1 px-3 py-2 w-20 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 w-full rounded-md sm:text-sm focus:ring-1"
                type="number"
                value={taskEstimation}
                onChange={(e) => setTaskEstimation(e.target.value)}
              />
              <div className="py-2">
                <BlueButtonBig onClick={saveTask}>Save</BlueButtonBig>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex columns-2 w-1/4">
        <div className="border-2 rounded-md m-4 min-w-full place-content-evenly">
          <h3 className="m-4 text-center text-2xl">Incomplete</h3>
          <Tasks
            tasks={incompleteTasks}
            setIncompleteTasks={setIncompleteTasks}
            setDoneTasks={setDoneTasks}
            setTasks={setTasks}
            allTasks={tasks}
            doneTasks={doneTasks}
            incompleteTasks={incompleteTasks}
            deleteTask={deleteTask}
            user={user}
          />
        </div>
        <div className="border-2 rounded-md m-4 min-w-full place-content-center">
          <h3 className="m-4 text-center text-2xl">Done</h3>
          <Tasks
            tasks={doneTasks}
            setIncompleteTasks={setIncompleteTasks}
            setDoneTasks={setDoneTasks}
            allTasks={tasks}
            doneTasks={doneTasks}
            incompleteTasks={incompleteTasks}
            deleteTask={deleteTask}
            user={user}
          />
        </div>
      </div>
    </div>
  );
};
