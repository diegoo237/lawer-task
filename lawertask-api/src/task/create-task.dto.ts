import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Tarefa de Teste',
  })
  @IsString({ message: 'titulo deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'Descrição da tarefa (opcional)',
    example: 'Descrição detalhada da tarefa',
    required: false,
  })
  @IsString({ message: 'descricao deve ser uma string' })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Status da tarefa',
    example: 'Pendente',
  })
  @IsString({ message: 'status deve ser uma string' })
  status: string;

  @ApiProperty({
    description: 'Prioridade da tarefa',
    example: 'Alta',
  })
  @IsString({ message: 'prioridade deve ser uma string' })
  priority: string;

  @ApiProperty({
    description: 'Data de vencimento da tarefa (opcional, formato ISO)',
    example: '2025-08-10T23:59:59.999Z',
    required: false,
  })
  @IsDateString({}, { message: 'duedate deve ser uma data valida' })
  @IsOptional()
  dueDate: string;

  @ApiProperty({
    description: 'ID do cliente associado (UUID)',
    example: '0be1138a-1d9f-4840-a0e8-27bf213cb1ed',
  })
  @IsUUID('4', { message: 'O is do cliente deve ser um UUID valido' })
  id: string;
}
