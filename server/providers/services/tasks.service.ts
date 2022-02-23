import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'server/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  findAllForProject(projectId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { projectId },
      relations: ['user', 'project'],
    });
  }

  createTask(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }

  findTaskById(id: number): Promise<Task> {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'project'],
    });
  }

  deleteTask(task: Task) {
    this.taskRepository.delete(task);
  }
}
