import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cliente, Prisma } from 'generated/prisma';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ClienteCreateInput): Promise<Cliente> {
    return this.prisma.cliente.create({ data });
  }

  async findAll(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: { deletedAt: null, ativo: true },
    });
  }

  async findOne(id: string): Promise<Cliente | null> {
    return this.prisma.cliente.findFirst({
      where: { id, deletedAt: null, ativo: true },
    });
  }

  async update(id: string, data: Prisma.ClienteUpdateInput): Promise<Cliente> {
    return this.prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Cliente> {
    return this.prisma.cliente.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        ativo: false,
      },
    });
  }
}
