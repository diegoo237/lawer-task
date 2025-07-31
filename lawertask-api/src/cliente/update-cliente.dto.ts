import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClienteDto {
  @ApiProperty({
    description: 'email do cliente (valor unico)',
    example: 'atualizado@atualizado.com',
    required: false,
  })
  @IsEmail({}, { message: 'email nao valido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'descriçao (opcional)',
    example: 'diego atualizado',
    required: false,
  })
  @IsString({ message: 'name precisa ser uma string' })
  @IsOptional()
  name?: string;
}
