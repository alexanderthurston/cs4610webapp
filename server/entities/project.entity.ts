import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';
import { ProjectMember } from './project_member.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  leaderId: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => User, (user) => user.projectsLed)
  leader: User;

  @OneToMany(() => Task, (task) => task.project, { cascade: true })
  tasks: Task[];

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.project)
  projectMembers: ProjectMember[];
}
