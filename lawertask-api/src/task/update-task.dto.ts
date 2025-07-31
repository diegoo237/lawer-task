import { IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa (opcional)',
    example: 'Tarefa Atualizada',
    required: false,
  })
  @IsString({ message: 'titulo deve ser uma string' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Descrição da tarefa (opcional)',
    example: 'Descrição atualizada da tarefa',
    required: false,
  })
  @IsString({ message: 'descricao deve ser uma string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Status da tarefa (opcional)',
    example: 'Em Andamento',
    required: false,
  })
  @IsString({ message: 'status deve ser uma string' })
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Prioridade da tarefa (opcional)',
    example: 'Média',
    required: false,
  })
  @IsString({ message: 'prioridade deve ser uma string' })
  @IsOptional()
  priority?: string;

  @ApiProperty({
    description: 'Data de vencimento da tarefa (opcional, formato ISO)',
    example: '2025-08-15T23:59:59.999Z',
    required: false,
  })
  @IsDateString({}, { message: 'duedate deve ser uma data valida' })
  @IsOptional()
  dueDate?: string;
}
