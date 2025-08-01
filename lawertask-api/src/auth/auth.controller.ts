import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Public } from './public.decorator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do cliente para login',
    example: 'teste@teste.com',
  })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do cliente',
    example: 'senha123',
  })
  @IsString({ message: 'A senha deve ser uma string' })
  senha: string;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Faz login e retorna um token JWT' })
  @ApiResponse({ status: 200, description: 'Token JWT gerado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() { email, senha }: LoginDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(email, senha);
  }
}
