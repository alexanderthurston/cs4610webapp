import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiContext } from '../../utils/api_context';
import { AuthContext } from '../../utils/auth_context';
import { RolesContext } from '../../utils/roles_context';
import { Button } from '../common/button';
import { Projects } from './projects';
import { PageHeader } from '../common/page_header';

export const Home = () => {
  const [, setAuthToken] = useContext(AuthContext);
  const [leaderProjects, setLeaderProjects] = useState([]);
  const [memberProjects, setMemberProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const api = useContext(ApiContext);
  const roles = useContext(RolesContext);

  const [user, setUser] = useState(null);
  useEffect(async () => {
    const res = await api.get('/users/me');
    setUser(res.user);
    const { leaderProjects } = await api.get('/projects/leader');
    setLeaderProjects(leaderProjects);
    const { memberProjects } = await api.get('/projects/member');
    setMemberProjects(memberProjects);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const logout = async () => {
    const res = await api.del('/sessions');
    if (res.success) {
      setAuthToken(null);
    }
  };

  const saveProject = async () => {
    const projectBody = {
      name: name,
    };
    const { project } = await api.post('/projects', projectBody);
    // console.log(projects);
    setLeaderProjects([...leaderProjects, project]);
  };

  const deleteProject = async (project) => {
    const { success } = await api.del(`/projects/${project.id}`);
    if (success) {
      setLeaderProjects(leaderProjects.filter((p) => p !== project));
    } else {
      setErrorMessage('Deletion failed. Please refresh and try again.');
    }
  };

  console.log(leaderProjects);
  console.log(memberProjects);

  return (
    <div>
      <PageHeader />
      <div className="flex p-4 m-4 border-2 bg-gray-200">
        <div className="w-1/2">
          <h1 className="text-6xl mb-2">Projects Overview</h1>
          <h2 className="text-3xl mb-2">
            {user.firstName} {user.lastName}
          </h2>
          <Button type="button" onClick={logout}>
            Logout
          </Button>
          {roles.includes('admin') && (
            <Button type="button" onClick={() => navigate('/admin')}>
              Admin
            </Button>
          )}
        </div>
        <div className="w-1/2 p-1 m-1 border-2 border-black">
          <h3 className="text-xl p-1">Create New Project</h3>
          <span className="p-2">
            <strong>Name: </strong>
            <input className="border-2" value={name} onChange={(e) => setName(e.target.value)} />
          </span>
          <Button onClick={saveProject}>Save</Button>
        </div>
      </div>
      <Projects leaderProjects={leaderProjects} memberProjects={memberProjects} deleteProject={deleteProject} />
    </div>
  );
};
