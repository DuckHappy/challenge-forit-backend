import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()

export class TasksService {

  // array de memoria
  // private readonly testTask = [];

 constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.task.findMany();
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException(`La tarea con el ${id} no fue encontrado`);
    }

    return task;
  }

  async create(dto: CreateTaskDto) {
    if (!dto.title || !dto.description) {
      throw new BadRequestException('Titulo y descripcion son requeridas');
    }

    return await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new NotFoundException(`La tarea con el ${id} no fue encontrado`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.task.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`La tarea con el ${id} no fue encontrado`);
    }
  }
}
