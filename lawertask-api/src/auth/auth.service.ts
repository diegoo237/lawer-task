import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClienteService } from '../cliente/cliente.service';
import { compare, hash } from 'bcrypt';
import { Cliente } from 'generated/prisma';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly clienteService: ClienteService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<Cliente | null> {
    this.logger.log(`Validando usuário com email: ${email}`);
    const cliente = await this.clienteService.findByEmail(email);
    if (!cliente) {
      this.logger.warn(`Cliente com email ${email} não encontrado`);
      return null;
    }
    const isPasswordValid = await compare(senha, cliente.senha);
    if (!isPasswordValid) {
      this.logger.warn(`Senha inválida para email ${email}`);
      return null;
    }
    this.logger.log(`Usuário ${email} validado com sucesso`);
    return cliente;
  }

  async login(email: string, senha: string): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, senha);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    this.logger.log(`Token JWT gerado para usuário ${email}`);
    return { access_token };
  }

  async hashPassword(senha: string): Promise<string> {
    return hash(senha, 10);
  }
}
