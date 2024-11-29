import { Module } from '@nestjs/common';
import { PrintJobService } from './print_job.service';
import { PrintJobController } from './print_job.controller';

@Module({
  providers: [PrintJobService],
  controllers: [PrintJobController]
})
export class PrintJobModule {}
