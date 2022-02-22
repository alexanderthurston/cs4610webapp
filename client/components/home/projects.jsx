import { Project } from './project';

export const Projects = ({ leaderProjects, memberProjects, deleteProject }) => {
  return (
    <div className="flex m-2 p-2">
      <div className="w-1/2 border-2">
        <div className="text-xl m-2 p-2">
          <strong>Leader Of</strong>
        </div>
        {leaderProjects.map((project) => (
          <Project key={project.id} project={project} deleteProject={deleteProject} />
        ))}
      </div>
      <div className="w-1/2 border-2">
        <div className="text-xl m-2 p-2">
          <strong>Member Of</strong>
        </div>
        {memberProjects.map((project) => (
          <Project key={project.id} project={project} deleteProject={deleteProject} />
        ))}
      </div>
    </div>
  );
};
