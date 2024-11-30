import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { PrintJobService } from './print_job.service';

@Controller('print-job')
export class PrintJobController {
  constructor(private readonly printJobService: PrintJobService) {}

  @Get('get-print-history')
  async getPrintHistory(@Query() req) {
    const {uid} = req
    if (!uid) {
      throw new HttpException('Student UID is required', HttpStatus.BAD_REQUEST);
    }

    const printHistory = await this.printJobService.getPrintHistory(uid);

    // Định dạng dữ liệu trả về
    return printHistory.map((job) => ({
      id: job.id,
      filename: job.filename,
      time: job.time,
      printer_name: job.printer.name,
      printer_floor: job.printer.floor,
      printer_building: job.printer.building,
      page: job.page,
      copy: job.copy,
      status: job.status,
    }));
  }

  @Post('create-print-job')
  async createPrintJob(@Body() body: any) {
    const { printer_id, student_id, filename, page_size, page, copy, two_side, color } = body;

    if (
      !printer_id ||
      !student_id ||
      !filename ||
      !page_size ||
      !page ||
      !copy ||
      two_side === undefined ||
      color === undefined
    ) {
      return { status: 'unsuccess', message: 'Thiếu thông tin yêu cầu' };
    }

    return this.printJobService.createPrintJob({
      printer_id,
      student_id,
      filename,
      page_size,
      page: parseInt(page, 10),
      copy: parseInt(copy, 10),
      two_side,
      color,
    });
  }
}
