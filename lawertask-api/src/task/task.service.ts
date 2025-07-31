import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Task, Prisma } from 'generated/prisma';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { deletedAt: null, ativo: true },
    });
  }

  async findOne(id: string): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: { id, deletedAt: null, ativo: true },
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        ativo: false,
      },
    });
  }
}
