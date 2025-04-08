import { Module } from '@nestjs/common';
import { PrintJobService } from './print_job.service';
import { PrintJobController } from './print_job.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PrintJobService, PrismaService],
  controllers: [PrintJobController],
})
export class PrintJobModule {}
