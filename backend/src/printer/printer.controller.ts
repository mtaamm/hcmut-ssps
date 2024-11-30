import { Controller, Post, Body } from '@nestjs/common';
import { PrinterService } from './printer.service';

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
    const twoSideBool = twoSide === true;
    const colorBool = color === true;
    console.log(pageSize, page, copy, twoSide, typeof(twoSide), color)
    return this.printerService.getMatchPrinters(
      pageSize,
      page,
      copy,
      twoSideBool,
      colorBool,
    );
  }
}
