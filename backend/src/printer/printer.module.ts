import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { PrinterController } from './printer.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PrinterService, PrismaService],
  controllers: [PrinterController]
})
export class PrinterModule {}
