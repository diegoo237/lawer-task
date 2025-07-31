import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClienteService } from './cliente/cliente.service';
import { TaskService } from './task/task.service';
import { Task as TaskModel, Cliente as ClienteModel } from 'generated/prisma';
import { CreateClienteDto } from './cliente/create-cliente.dto';
import { CreateTaskDto } from './task/create-task.dto';
import { UpdateClienteDto } from './cliente/update-cliente.dto';
import { UpdateTaskDto } from './task/update-task.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('clientes')
@Controller('api')
export class AppController {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly taskService: TaskService,
  ) {}

  // TASKS
  @Post('tasks')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateTaskDto })
  async createTask(@Body() postData: CreateTaskDto): Promise<TaskModel> {
    const { title, description, status, priority, dueDate, id } = postData;
    return this.taskService.create({
      title,
      description: description ?? null,
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
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Tarefa encontrada',
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async findOneTask(@Param('id') id: string): Promise<TaskModel> {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }
    return task;
  }

  @Put('tasks/:id')
  @ApiOperation({ summary: 'Atualiza uma tarefa' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  @ApiBody({ type: UpdateTaskDto })
  async updateTask(
    @Param('id') id: string,
    @Body() data: UpdateTaskDto,
  ): Promise<TaskModel> {
    return this.taskService.update(id, data);
  }

  @Delete('tasks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui (soft delete) uma tarefa' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  @ApiResponse({ status: 204, description: 'Tarefa excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.taskService.softDelete(id);
  }

  // CLIENTES
  @Post('cliente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateClienteDto })
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
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findOneCliente(@Param('id') id: string): Promise<ClienteModel> {
    const cliente = await this.clienteService.findOne(id);
    if (!cliente) {
      throw new NotFoundException(
        `Cliente com ID ${id} não encontrado ou foi deletado`,
      );
    }
    return cliente;
  }

  @Put('cliente/:id')
  @ApiOperation({ summary: 'Atualiza um cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiBody({ type: UpdateClienteDto })
  async updateCliente(
    @Param('id') id: string,
    @Body() data: UpdateClienteDto,
  ): Promise<ClienteModel> {
    return this.clienteService.update(id, data);
  }

  @Delete('cliente/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Exclui (soft delete) um cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  @ApiResponse({ status: 204, description: 'Cliente excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async deleteCliente(@Param('id') id: string): Promise<void> {
    await this.clienteService.softDelete(id);
  }
}
