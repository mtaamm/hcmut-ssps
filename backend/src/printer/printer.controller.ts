import { Controller, Post, Body, Query, Get, Delete } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { CreatePrinterParam, PageSize } from './dto/create-printer.dto';

@Controller('printer')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Post('get-match-printers')
  async getMatchPrinters(
    @Body('page_size') pageSize: string,
    @Body('page') page: number,
    @Body('copy') copy: number,
    @Body('two_side') twoSide: boolean,
    @Body('color') color: boolean,
  ) {
    console.log(pageSize, page, copy, twoSide, color)
    return this.printerService.getMatchPrinters(
      pageSize,
      page,
      copy,
      twoSide,
      color,
    );
  }

  @Get('get-all')
  async getAllPrinters(@Query('uid') uid: string) {
    if (!uid) {
      return { status: 'unsuccess', message: 'UID không được để trống', data: [] };
    }

    return this.printerService.getAllPrinters(uid);
  }

  @Post('create')
  async createPrinter(@Body() body: CreatePrinterParam) {
    const { uid, printer } = body;

    if (!uid || !printer) {
      return {
        status: 'unsuccess',
        message: 'UID và printer không được để trống',
      };
    }

    return this.printerService.createPrinter(body);
  }

  @Post('edit')
  async editPrinter(
    @Body()
    body: {
      uid: string;
      printer_id: string;
      page_size: PageSize[];
      floor: number;
      building: string;
    },
  ) {
    const { uid, printer_id, page_size, floor, building } = body;

    // Kiểm tra đầu vào
    if (!uid || !printer_id || !page_size || floor == null || !building) {
      return {
        status: 'unsuccess',
        message: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại',
      };
    }

    return this.printerService.editPrinter(body);
  }

  @Post('toggle-status')
  async toggleStatus(
    @Body() body: { uid: string; printer_id: string },
  ) {
    const { uid, printer_id } = body;

    // Kiểm tra đầu vào
    if (!uid || !printer_id) {
      return {
        status: 'unsuccess',
        message: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại',
      };
    }

    return this.printerService.toggleStatus(body);
  }

  @Post('delete')
  async deletePrinter(
    @Body() body: { uid: string; printer_id: string },
  ) {
    const { uid, printer_id } = body;

    // Kiểm tra đầu vào
    if (!uid || !printer_id) {
      return {
        status: 'unsuccess',
        message: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại',
      };
    }

    return this.printerService.deletePrinter(body);
  }

}
