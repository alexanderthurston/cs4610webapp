import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { JwtBody } from 'server/decorators/jwt_body.decorator';
import { JwtBodyDto } from 'server/dto/jwt_body.dto';
import { Project } from 'server/entities/project.entity';
import { Task } from 'server/entities/task.entity';
import { ProjectMemberService } from 'server/providers/services/project.member.service';
import { ProjectsService } from 'server/providers/services/projects.service';
import { TasksService } from 'server/providers/services/tasks.service';
import { UsersService } from 'server/providers/services/users.service';

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
  constructor(
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    private usersService: UsersService,
    private projectMemberService: ProjectMemberService,
  ) {}

  @Get('/projects/leader')
  public async index(@JwtBody() jwtBody: JwtBodyDto) {
    const projects = await this.projectsService.findAllForUser(jwtBody.userId);
    return { leaderProjects: projects };
  }

  @Get('/projects/member')
  public async indexMemberOf(@JwtBody() jwtBody: JwtBodyDto) {
    const projects = await this.projectsService.findAllWithMember(jwtBody.userId);
    return { memberProjects: projects };
  }

  @Get('/projects/memberOf')
  public async memberOf(@JwtBody() jwtBody: JwtBodyDto) {
    const projectMembers = await this.projectMemberService.findAllForUserId(jwtBody.userId);
    const projects = [];
    for (const projectMember of projectMembers) {
      projects.push(await this.projectsService.findProjectById(projectMember.projectId));
    }
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
    task.userId = jwtBody.userId;
    task.projectId = body.projectId;
    task.title = body.title;
    task.description = body.description;
    task.timeEstimation = body.timeEstimation;
    task.status = body.status;
    task.user = await this.usersService.find(jwtBody.userId);
    task.project = await this.projectsService.findProjectById(body.projectId);
    task = await this.tasksService.createTask(task);
    return { task };
  }

  @Put('projects/:id/tasks/:task_id')
  public async updateTask(@Param('task_id') task_id: string, @Body() body: TaskBody, @JwtBody() jwtBody: JwtBodyDto) {
    let task = new Task();
    task.id = parseInt(task_id, 10);
    task.userId = body.userId;
    task.projectId = body.projectId;
    task.title = body.title;
    task.description = body.description;
    task.timeEstimation = body.timeEstimation;
    task.status = body.status;
    task.user = await this.usersService.find(jwtBody.userId);
    task.project = await this.projectsService.findProjectById(body.projectId);
    task = await this.tasksService.createTask(task);
    return { task };
  }

  @Delete('projects/:id/tasks/:task_id')
  public async deleteTask(@Param('task_id') task_id: string, @JwtBody() jwtBody: JwtBodyDto) {
    const task = await this.tasksService.findTaskById(parseInt(task_id, 10));
    console.log(task.project.leaderId);
    if (task.userId == jwtBody.userId || task.project.leaderId == jwtBody.userId) {
      this.tasksService.deleteTask(task);
      return { success: true };
    }
    return { success: false };
  }
}
