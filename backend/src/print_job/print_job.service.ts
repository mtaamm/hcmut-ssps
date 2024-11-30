import { tr } from '@faker-js/faker/.';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrintJobService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrintHistory(uid: string) {
    // Truy vấn lịch sử in của student
    return this.prisma.print_job.findMany({
      where: { student_id: uid },
      select: {
        id: true,
        filename: true,
        time: true,
        page: true,
        copy: true,
        status: true,
        printer: {
          select: {
            name: true, // Lấy tên của printer
            floor: true,
            building: true
          },
        },
      },
      orderBy: { time: 'desc' }, // Sắp xếp theo thời gian mới nhất
    });
  }

  async createPrintJob(data: {
    printer_id: string;
    student_id: string;
    filename: string;
    page_size: string;
    page: number;
    copy: number;
    two_side: boolean;
    color: boolean;
  }): Promise<{ status: string; message: string }> {
    const { printer_id, student_id, filename, page_size, page, copy, two_side, color } = data;

    // Tổng số trang cần thiết
    const totalPagesRequired = page * copy;

    // Kiểm tra student_id có hợp lệ
    const student = await this.prisma.user.findUnique({
      where: { uid: student_id },
      include: { page_size: true },
    });

    if (!student || student.role !== 'student') {
      return { status: 'unsuccess', message: 'Student ID không hợp lệ' };
    }

    // Kiểm tra printer_id có hợp lệ
    const printer = await this.prisma.printer.findUnique({
      where: { id: printer_id },
      include: {
        page_size: true,
      },
    });

    if (!printer || printer.status !== 'enable') {
      return { status: 'unsuccess', message: 'Printer ID không hợp lệ hoặc không khả dụng' };
    }

    // Kiểm tra khổ giấy và số lượng trang của student
    const studentPageSize = student.page_size.find((ps) => ps.page_size === page_size);
    if (!studentPageSize || studentPageSize.current_page < totalPagesRequired) {
      return {
        status: 'unsuccess',
        message: 'Sinh viên không đủ số lượng trang cho khổ giấy yêu cầu',
      };
    }

    // Kiểm tra khổ giấy và số lượng trang của printer
    const printerPageSize = printer.page_size.find((ps) => ps.page_size === page_size);
    if (!printerPageSize || printerPageSize.current_page < totalPagesRequired) {
      return {
        status: 'unsuccess',
        message: 'Máy in không đủ số lượng trang cho khổ giấy yêu cầu',
      };
    }

    // Kiểm tra các điều kiện về two_side và color
    if (printer.two_side !== two_side || printer.color !== color) {
      return {
        status: 'unsuccess',
        message: 'Máy in không đáp ứng yêu cầu về in hai mặt hoặc màu sắc',
      };
    }

    // Tạo print_job và cập nhật số trang
    await this.prisma.$transaction([
      // Tạo print_job
      this.prisma.print_job.create({
        data: {
          printer_id,
          student_id,
          filename,
          page_size,
          page,
          copy,
          two_side,
          color,
          status: 'progress',
          time: new Date(),
        },
      }),

      // Cập nhật student_page_size
      this.prisma.student_page_size.update({
        where: { student_id_page_size: { student_id, page_size } },
        data: { current_page: studentPageSize.current_page - totalPagesRequired },
      }),

      // Cập nhật printer_page_size
      this.prisma.printer_page_size.update({
        where: { printer_id_page_size: { printer_id, page_size } },
        data: { current_page: printerPageSize.current_page - totalPagesRequired },
      }),
    ]);

    return { status: 'success', message: 'Lệnh in đã được tạo thành công' };
  }
}
