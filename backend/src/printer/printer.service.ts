import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrinterParam, PageSize } from './dto/create-printer.dto';
import { tr } from '@faker-js/faker/.';

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

  async getAllPrinters(uid: string): Promise<{
    status: string;
    message: string;
    data: any[];
  }> {
    // Kiểm tra uid có hợp lệ và có phải admin không
    const user = await this.prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      return { status: 'unsuccess', message: 'UID không tồn tại', data: [] };
    }

    if (user.role !== 'spso') {
      return { status: 'unsuccess', message: 'Không có quyền truy cập', data: [] };
    }

    // Lấy danh sách tất cả printer
    const printers = await this.prisma.printer.findMany({
      select: {
        id: true,
        name: true,
        machine_type: true,
        time: true,
        floor: true,
        building: true,
        status: true,
        two_side: true,
        color: true,
        page_size: true
      },
      orderBy: {time: "desc"}
    });

    return { status: 'success', message: 'success', data: printers };
  }

  async createPrinter(param: CreatePrinterParam): Promise<{
    status: string;
    message: string;
  }> {
    const { uid, printer } = param;

    // Kiểm tra UID hợp lệ và có phải role SPSO không
    const user = await this.prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      return { status: 'unsuccess', message: 'UID không tồn tại' };
    }

    if (user.role !== 'spso') {
      return { status: 'unsuccess', message: 'Không có quyền thực hiện thao tác này' };
    }

    // Tạo printer mới
    try {
      const newPrinter = await this.prisma.printer.create({
        data: {
          name: printer.name,
          machine_type: printer.machine_type,
          time: new Date(),
          floor: printer.floor,
          building: printer.building,
          two_side: printer.two_side,
          color: printer.color,
          status: 'enable',
        },
      });

      await Promise.all(
        printer.page_size.map((pageSize) =>
          this.prisma.printer_page_size.create({
            data: {
              printer_id: newPrinter.id,
              page_size: pageSize.page_size,
              current_page: pageSize.current_page,
            },
          }),
        ),
      );

      return { status: 'success', message: 'Printer created successfully' };
    } catch (error) {
      return { status: 'unsuccess', message: 'Lỗi khi tạo printer' };
    }
  }

  async editPrinter(param: {
    uid: string;
    printer_id: string;
    page_size: PageSize[];
    floor: number;
    building: string;
  }): Promise<{
    status: string;
    message: string;
  }> {
    const { uid, printer_id, page_size, floor, building } = param;
  
    // Kiểm tra UID hợp lệ và có phải role SPSO không
    const user = await this.prisma.user.findUnique({
      where: { uid },
    });
  
    if (!user) {
      return { status: 'unsuccess', message: 'UID không tồn tại' };
    }
  
    if (user.role !== 'spso') {
      return { status: 'unsuccess', message: 'Không có quyền thực hiện thao tác này' };
    }
  
    // Kiểm tra printer_id hợp lệ
    const printer = await this.prisma.printer.findUnique({
      where: { id: printer_id },
    });
  
    if (!printer) {
      return { status: 'unsuccess', message: 'Printer ID không tồn tại' };
    }
  
    try {
      // Cập nhật thông tin printer
      await this.prisma.printer.update({
        where: { id: printer_id },
        data: { floor, building },
      });
  
      // Xóa page_size cũ và thêm page_size mới
      await this.prisma.printer_page_size.deleteMany({
        where: { printer_id },
      });
  
      await Promise.all(
        page_size.map((page) =>
          this.prisma.printer_page_size.create({
            data: {
              printer_id,
              page_size: page.page_size,
              current_page: page.current_page,
            },
          }),
        ),
      );
  
      return { status: 'success', message: 'Printer updated successfully' };
    } catch (error) {
      return { status: 'unsuccess', message: 'Lỗi khi cập nhật printer' };
    }
  }

  async toggleStatus(param: { uid: string; printer_id: string }): Promise<{
    status: string;
    message: string;
  }> {
    const { uid, printer_id } = param;
  
    // Kiểm tra UID hợp lệ và có phải role SPSO không
    const user = await this.prisma.user.findUnique({
      where: { uid },
    });
  
    if (!user) {
      return { status: 'unsuccess', message: 'UID không tồn tại' };
    }
  
    if (user.role !== 'spso') {
      return { status: 'unsuccess', message: 'Không có quyền thực hiện thao tác này' };
    }
  
    // Kiểm tra printer_id hợp lệ
    const printer = await this.prisma.printer.findUnique({
      where: { id: printer_id },
    });
  
    if (!printer) {
      return { status: 'unsuccess', message: 'Printer ID không tồn tại' };
    }
  
    try {
      // Đổi trạng thái status
      const updatedStatus = printer.status === 'enable' ? 'disable' : 'enable';
      await this.prisma.printer.update({
        where: { id: printer_id },
        data: { status: updatedStatus },
      });
  
      return { status: 'success', message: `Printer status updated to ${updatedStatus}` };
    } catch (error) {
      return { status: 'unsuccess', message: 'Lỗi khi cập nhật trạng thái printer' };
    }
  }

  async deletePrinter(param: { uid: string; printer_id: string }): Promise<{
    status: string;
    message: string;
  }> {
    const { uid, printer_id } = param;
  
    // Kiểm tra UID hợp lệ và có phải role SPSO không
    const user = await this.prisma.user.findUnique({
      where: { uid },
    });
  
    if (!user) {
      return { status: 'unsuccess', message: 'UID không tồn tại' };
    }
  
    if (user.role !== 'spso') {
      return { status: 'unsuccess', message: 'Không có quyền thực hiện thao tác này' };
    }
  
    // Kiểm tra printer_id hợp lệ
    const printer = await this.prisma.printer.findUnique({
      where: { id: printer_id },
    });
  
    if (!printer) {
      return { status: 'unsuccess', message: 'Printer ID không tồn tại' };
    }
  
    try {
      // Xóa printer
      await this.prisma.printer.delete({
        where: { id: printer_id },
      });
  
      return { status: 'success', message: 'Printer đã được xóa thành công' };
    } catch (error) {
      return { status: 'unsuccess', message: 'Lỗi khi xóa printer' };
    }
  }
  
  async getPrinterDetail(param: { uid: string; printer_id: string }): Promise<{
    status: string;
    message: string;
    data?: any;
  }> {
    const { uid, printer_id } = param;
  
    const user = await this.prisma.user.findUnique({
      where: { uid },
    });
  
    if (!user) {
      return { status: 'unsuccess', message: 'UID không tồn tại' };
    }
  
    if (user.role !== 'spso') {
      return { status: 'unsuccess', message: 'Không có quyền thực hiện thao tác này' };
    }
  
    // Kiểm tra printer_id có tồn tại
    const printer = await this.prisma.printer.findUnique({
      where: { id: printer_id },
      include: {
        page_size: {
          select: {
            page_size: true,
            current_page: true
          }
        }, // Bao gồm thông tin page_size của printer
      },
    });
  
    if (!printer) {
      return { status: 'unsuccess', message: 'Printer ID không tồn tại' };
    }
  
    // Truy vấn các print_job liên quan đến printer
    const printJobs = await this.prisma.print_job.findMany({
      where: { printer_id },
      include: {
        user: {
          select: { mssv: true },
        },
      },
      orderBy: {time: 'desc'}
    });
  
    // Chuẩn bị dữ liệu trả về
    const data = {
      id: printer.id,
      name: printer.name,
      machine_type: printer.machine_type,
      floor: printer.floor,
      building: printer.building,
      status: printer.status,
      two_side: printer.two_side,
      color: printer.color,
      page_size: printer.page_size,
      print_jobs: printJobs.map((job) => ({
        id: job.id,
        filename: job.filename,
        time: job.time,
        page: job.page,
        page_size: job.page_size,
        copy: job.copy,
        status: job.status,
        mssv: job.user?.mssv || null,
      })),
    };
  
    return { status: 'success', message: 'Success', data };
  }
  
}
