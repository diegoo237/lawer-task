import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ClienteService } from './cliente/cliente.service';
import { TaskService } from './task/task.service';
import { Task as TaskModel, Cliente as ClienteModel } from 'generated/prisma';
import { CreateClienteDto } from './cliente/create-cliente.dto';
import { CreateTaskDto } from './task/create-task.dto';
import { UpdateClienteDto } from './cliente/update-cliente.dto';
import { UpdateTaskDto } from './task/update-task.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('clientes')
@Controller('api')
export class AppController {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly taskService: TaskService,
  ) {}

  //TASKS
  @Post('tasks')
  @ApiOperation({ summary: 'Cria uma nova tarefa' })
  async createTask(@Body() postData: CreateTaskDto): Promise<TaskModel> {
    const { title, description, status, priority, dueDate, id } = postData;
    return this.taskService.create({
      title,
      description,
      status,
      priority,
      dueDate,
      cliente: {
        connect: { id },
      },
    });
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Lista todas as tarefas' })
  async getTask(): Promise<TaskModel[]> {
    return this.taskService.findAll();
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Busca uma tarefa por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  async findOneTask(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Put('tasks/:id')
  @ApiOperation({ summary: 'Atualiza uma tarefa' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  async updateTask(
    @Param('id') id: string,
    @Body() data: UpdateTaskDto,
  ): Promise<TaskModel> {
    return this.taskService.update(id, data);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Exclui (soft delete) uma tarefa' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  async deleteTask(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.softDelete(id);
  }

  //CLIENTES

  @Post('cliente')
  @ApiOperation({ summary: 'Cria um novo cliente' })
  async createCliente(
    @Body() postData: CreateClienteDto,
  ): Promise<ClienteModel> {
    const { email, name } = postData;
    return this.clienteService.create({
      email,
      name,
    });
  }

  @Get('cliente')
  @ApiOperation({ summary: 'Lista todos os clientes' })
  async getCliente(): Promise<ClienteModel[]> {
    return this.clienteService.findAll();
  }

  @Get('cliente/:id')
  @ApiOperation({ summary: 'Busca um cliente por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  async findOneCliente(@Param('id') id: string) {
    return this.clienteService.findOne(id);
  }

  @Put('cliente/:id')
  @ApiOperation({ summary: 'Atualiza um cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  async updateCliente(
    @Param('id') id: string,
    @Body() data: UpdateClienteDto,
  ): Promise<ClienteModel> {
    return this.clienteService.update(id, data);
  }

  @Delete('cliente/:id')
  @ApiOperation({ summary: 'Exclui (soft delete) um cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  async deleteCliente(@Param('id') id: string): Promise<ClienteModel> {
    return this.clienteService.softDelete(id);
  }
}
