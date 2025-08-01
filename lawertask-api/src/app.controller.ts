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
  UseGuards,
} from '@nestjs/common';
import { Task as TaskModel, Cliente as ClienteModel } from 'generated/prisma';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from './auth/public.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { CreateClienteDto } from './cliente/create-cliente.dto';
import { CreateTaskDto } from './task/create-task.dto';
import { UpdateClienteDto } from './cliente/update-cliente.dto';
import { UpdateTaskDto } from './task/update-task.dto';

import { ClienteService } from './cliente/cliente.service';
import { TaskService } from './task/task.service';
import { AuthService } from './auth/auth.service';

@Controller('api')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppController {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
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
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.taskService.softDelete(id);
  }

  // CLIENTES
  @Public()
  @Post('cliente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiBody({ type: CreateClienteDto })
  async createCliente(
    @Body() postData: CreateClienteDto,
  ): Promise<ClienteModel> {
    const { email, name, senha } = postData;
    return this.clienteService.create({
      email,
      name,
      senha: await this.authService.hashPassword(senha),
    });
  }

  @Get('cliente')
  @ApiOperation({ summary: 'Lista todos os clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
  @ApiResponse({ status: 401, description: 'Não autorizado' })
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
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async deleteCliente(@Param('id') id: string): Promise<void> {
    await this.clienteService.softDelete(id);
  }
}
