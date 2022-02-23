import { Button } from '../common/button';
import { useState } from 'react';

export const ProjectMemberSelect = ({ projectMembers, updateTaskAssignment }) => {
  if (!projectMembers.length) {
    return null;
  }
  const [assigned, setAssigned] = useState(projectMembers[0].userId);

  return (
    <div className="border-2 p-4 w-full">
      <p className="underline">Assign Project Member:</p>
      <select value={assigned} onChange={(e) => setAssigned(e.target.value)}>
        {projectMembers.map((pm) => (
          <option className="truncate" key={pm.id} value={pm.userId}>
            {pm.user.email}
          </option>
        ))}
      </select>
      <Button onClick={() => updateTaskAssignment(assigned)}>Change Assignment</Button>
    </div>
  );
};
