import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrinterModule } from './printer/printer.module';
import { PrintJobModule } from './print_job/print_job.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, PrinterModule, PrintJobModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
