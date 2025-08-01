import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClienteService } from '../cliente/cliente.service';
import { Cliente } from 'generated/prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly clienteService: ClienteService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'G8MNNGwr%<!DSs`7#d*|Jf=2whIYxP4f',
    });
  }

  async validate(payload: { sub: string; email: string }): Promise<Cliente> {
    const cliente = await this.clienteService.findOne(payload.sub);
    if (!cliente) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return cliente;
  }
}
