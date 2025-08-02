import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Task, Prisma } from 'generated/prisma';
import { UpdateTaskDto } from './update-task.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    this.logger.log(`Criando tarefa: ${JSON.stringify(data)}`);
    try {
      const task = await this.prisma.task.create({ data });
      this.logger.log(`Tarefa criada com ID: ${task.id}`);
      return task;
    } catch (error) {
      this.logger.error(`Erro ao criar tarefa: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Task[]> {
    this.logger.log('Buscando todas as tarefas ativas');
    const tasks = await this.prisma.task.findMany({
      where: { deletedAt: null, ativo: true },
    });
    this.logger.log(`Encontradas ${tasks.length} tarefas ativas`);
    return tasks;
  }

  async findOne(id: string): Promise<Task | null> {
    this.logger.log(`Buscando tarefa com ID: ${id}`);
    const task = await this.prisma.task.findFirst({
      where: { id, deletedAt: null, ativo: true },
    });
    this.logger.log(`Tarefa ${id} ${task ? 'encontrada' : 'não encontrada'}`);
    return task;
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    this.logger.log(
      `Atualizando tarefa com ID: ${id}, dados: ${JSON.stringify(data)}`,
    );

    try {
      const task = await this.findOne(id);

      if (!task) {
        this.logger.warn(`Tarefa com ID ${id} não encontrada para atualização`);
        throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
      }

      const { clientId, ...taskData } = data;

      const updateData: Prisma.TaskUpdateInput = {
        ...taskData,
        ...(clientId && {
          cliente: {
            connect: { id: clientId },
          },
        }),
      };

      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: updateData,
      });

      this.logger.log(`Tarefa com ID ${id} atualizada com sucesso`);
      return updatedTask;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar tarefa ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async softDelete(id: string): Promise<Task> {
    this.logger.log(`Iniciando soft delete da tarefa com ID: ${id}`);
    try {
      const task = await this.findOne(id);
      if (!task) {
        this.logger.warn(`Tarefa com ID ${id} não encontrada para exclusão`);
        throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
      }
      const deletedTask = await this.prisma.task.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          ativo: false,
        },
      });
      this.logger.log(`Tarefa com ID ${id} excluída (soft delete) com sucesso`);
      return deletedTask;
    } catch (error) {
      this.logger.error(
        `Erro ao excluir tarefa ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
