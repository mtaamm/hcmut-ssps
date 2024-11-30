import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrinterService {
  constructor(private readonly prisma: PrismaService) {}

  async getMatchPrinters(
    pageSize: string,
    page: number,
    copy: number,
    twoSide: boolean,
    color: boolean,
  ): Promise<{ id: string; name: string; floor: number; building: string }[]> {
    // Tổng số trang cần thiết
    const totalPagesRequired = page * copy;

    // Lấy danh sách máy in phù hợp với điều kiện
    const printers = await this.prisma.printer.findMany({
      where: {
        status: 'enable',
        two_side: twoSide,
        color: color,
        page_size: {
          some: {
            page_size: pageSize,
            current_page: {
              gte: totalPagesRequired,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        floor: true,
        building: true,
      },
    });

    return printers;
  }
}
