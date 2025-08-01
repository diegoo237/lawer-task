import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClienteService } from './cliente/cliente.service';
import { TaskService } from './task/task.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [PrismaService, ClienteService, TaskService],
})
export class AppModule {}
