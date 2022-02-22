import { Body, Controller, Delete, Get, HttpException, Param, Post, Put } from '@nestjs/common';
import { JwtBody } from 'server/decorators/jwt_body.decorator';
import { JwtBodyDto } from 'server/dto/jwt_body.dto';
import { Project } from 'server/entities/project.entity';
import { ProjectMember } from 'server/entities/project_member.entity';
import { Task } from 'server/entities/task.entity';
import { ProjectsService } from 'server/providers/services/projects.service';
import { TasksService } from 'server/providers/services/tasks.service';

class ProjectBody {
  name: string;
}

class TaskBody {
  userId: number;
  projectId: number;
  title: string;
  description: string;
  timeEstimation: string;
  status: string;
}

@Controller()
export class ProjectsController {
  constructor(private projectsService: ProjectsService, private tasksService: TasksService) {}

  @Get('/projects')
  public async index(@JwtBody() jwtBody: JwtBodyDto) {
    const projects = await this.projectsService.findAllForUser(jwtBody.userId);
    return { projects };
  }

  @Post('/projects')
  public async create(@JwtBody() jwtBody: JwtBodyDto, @Body() body: ProjectBody) {
    let project = new Project();
    project.leaderId = jwtBody.userId;
    project.name = body.name;
    project = await this.projectsService.createProject(project);
    return { project };
  }

  @Delete('/projects/:id')
  public async destroy(@Param('id') id: string, @JwtBody() jwtBody: JwtBodyDto) {
    const project = await this.projectsService.findProjectById(parseInt(id, 10));
    if (project.leaderId !== jwtBody.userId) {
      throw new HttpException('Unauthorized', 401);
    }

    this.projectsService.removeProject(project);

    return { success: true };
  }

  @Get('/projects/:id/tasks')
  public async getTasks(@Param('id') id: string) {
    const tasks = await this.tasksService.findAllForProject(parseInt(id, 10));
    return { tasks };
  }

  @Post('/projects/:id/tasks')
  public async createTask(@JwtBody() jwtBody: JwtBodyDto, @Body() body: TaskBody) {
    let task = new Task();
    task.userId = body.userId;
    task.projectId = body.projectId;
    task.title = body.title;
    task.description = body.description;
    task.timeEstimation = body.timeEstimation;
    task.status = body.status;
    task = await this.tasksService.createTask(task);
    return { task };
  }

  @Put('projects/:id/tasks/:task_id')
  public async updateTask(@Param('task_id') task_id: string, @Body() body: TaskBody) {
    let task = new Task();
    task.id = parseInt(task_id, 10);
    task.userId = body.userId;
    task.projectId = body.projectId;
    task.title = body.title;
    task.description = body.description;
    task.timeEstimation = body.timeEstimation;
    task.status = body.status;
    task = await this.tasksService.createTask(task);
    return { task };
  }
}
