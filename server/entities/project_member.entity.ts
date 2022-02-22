import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('projectMember')
export class ProjectMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  projectId: number;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => Project, (project) => project.projectMembers)
  project: Project;

  @ManyToOne(() => User, (user) => user.projectMembers)
  user: User;
}
