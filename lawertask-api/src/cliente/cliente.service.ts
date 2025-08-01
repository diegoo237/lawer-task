import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cliente, Prisma } from 'generated/prisma';

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ClienteCreateInput): Promise<Cliente> {
    this.logger.log(`Criando cliente: ${JSON.stringify(data)}`);
    try {
      const cliente = await this.prisma.cliente.create({ data });
      this.logger.log(`Cliente criado com ID: ${cliente.id}`);
      return cliente;
    } catch (error) {
      this.logger.error(`Erro ao criar cliente: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Cliente[]> {
    this.logger.log('Buscando todos os clientes ativos');
    const clientes = await this.prisma.cliente.findMany({
      where: { deletedAt: null, ativo: true },
    });
    this.logger.log(`Encontrados ${clientes.length} clientes ativos`);
    return clientes;
  }

  async findOne(id: string): Promise<Cliente | null> {
    this.logger.log(`Buscando cliente com ID: ${id}`);
    const cliente = await this.prisma.cliente.findFirst({
      where: { id, deletedAt: null, ativo: true },
    });
    this.logger.log(
      `Cliente ${id} ${cliente ? 'encontrado' : 'não encontrado'}`,
    );
    return cliente;
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    this.logger.log(`Buscando cliente com email: ${email}`);
    const cliente = await this.prisma.cliente.findFirst({
      where: { email, deletedAt: null, ativo: true },
    });
    this.logger.log(
      `Cliente com email ${email} ${cliente ? 'encontrado' : 'não encontrado'}`,
    );
    return cliente;
  }

  async update(id: string, data: Prisma.ClienteUpdateInput): Promise<Cliente> {
    this.logger.log(
      `Atualizando cliente com ID: ${id}, dados: ${JSON.stringify(data)}`,
    );
    try {
      const cliente = await this.findOne(id);
      if (!cliente) {
        this.logger.warn(
          `Cliente com ID ${id} não encontrado para atualização`,
        );
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }
      const updatedCliente = await this.prisma.cliente.update({
        where: { id },
        data,
      });
      this.logger.log(`Cliente com ID ${id} atualizado com sucesso`);
      return updatedCliente;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar cliente ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async softDelete(id: string): Promise<Cliente> {
    this.logger.log(`Iniciando soft delete do cliente com ID: ${id}`);
    try {
      const cliente = await this.findOne(id);
      if (!cliente) {
        this.logger.warn(`Cliente com ID ${id} não encontrado para exclusão`);
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }
      const deletedCliente = await this.prisma.cliente.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          ativo: false,
        },
      });
      this.logger.log(
        `Cliente com ID ${id} excluído (soft delete) com sucesso`,
      );
      return deletedCliente;
    } catch (error) {
      this.logger.error(
        `Erro ao excluir cliente ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
