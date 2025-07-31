import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    description: 'email do cliente (valor unico)',
    example: 'teste@teste.com',
  })
  @IsEmail({}, { message: 'email nao valido' })
  email: string;

  @ApiProperty({
    description: 'nome do cliente',
    example: 'diego',
  })
  @IsString({ message: 'name precisa ser uma string' })
  name: string;
}
