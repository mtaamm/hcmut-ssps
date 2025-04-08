import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
            building: true,
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
    const {
      printer_id,
      student_id,
      filename,
      page_size,
      page,
      copy,
      two_side,
      color,
    } = data;

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
      return {
        status: 'unsuccess',
        message: 'Printer ID không hợp lệ hoặc không khả dụng',
      };
    }

    // Kiểm tra khổ giấy và số lượng trang của student
    const studentPageSize = student.page_size.find(
      (ps) => ps.page_size === page_size,
    );
    if (!studentPageSize || studentPageSize.current_page < totalPagesRequired) {
      return {
        status: 'unsuccess',
        message: 'Sinh viên không đủ số lượng trang cho khổ giấy yêu cầu',
      };
    }

    // Kiểm tra khổ giấy và số lượng trang của printer
    const printerPageSize = printer.page_size.find(
      (ps) => ps.page_size === page_size,
    );
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
        data: {
          current_page: studentPageSize.current_page - totalPagesRequired,
        },
      }),

      // Cập nhật printer_page_size
      this.prisma.printer_page_size.update({
        where: { printer_id_page_size: { printer_id, page_size } },
        data: {
          current_page: printerPageSize.current_page - totalPagesRequired,
        },
      }),
    ]);

    return { status: 'success', message: 'Lệnh in đã được tạo thành công' };
  }

  async getStudentHistorySpso(
    spso_id: string,
    uid: string,
  ): Promise<{
    status: string;
    message: string;
    data?: any;
  }> {
    // Kiểm tra `spso_id` có tồn tại và role có đúng không
    const spso = await this.prisma.user.findUnique({
      where: { uid: spso_id },
    });

    if (!spso) {
      throw new HttpException('SPSO ID không tồn tại', HttpStatus.BAD_REQUEST);
    }

    if (spso.role !== 'spso') {
      throw new HttpException(
        'Người dùng không có quyền truy cập',
        HttpStatus.FORBIDDEN,
      );
    }

    // Kiểm tra `uid` có tồn tại hay không
    const student = await this.prisma.user.findUnique({
      where: { uid },
      include: {
        page_size: true, // Lấy thông tin số trang theo từng khổ giấy
        print_job: {
          include: {
            printer: { select: { name: true } }, // Lấy `printer_name` từ bảng `printer`
          },
        },
      },
    });

    if (!student || student.role !== 'student') {
      throw new HttpException(
        'Student ID không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Xử lý dữ liệu student
    const totalPage = student.page_size.reduce(
      (sum, pageSize) => sum + pageSize.current_page,
      0,
    );

    const totalPrintJob = student.print_job.length;

    const progressPrintJob = student.print_job.filter(
      (job) => job.status === 'progress',
    ).length;

    const successPrintJob = student.print_job.filter(
      (job) => job.status === 'success',
    ).length;

    const failPrintJob = student.print_job.filter(
      (job) => job.status === 'fail',
    ).length;

    // Trả về kết quả
    return {
      status: 'success',
      message: 'Thành công',
      data: {
        name: student.name,
        mssv: student.mssv || null,
        total_page: totalPage,
        total_print_job: totalPrintJob,
        progress_print_job: progressPrintJob,
        success_print_job: successPrintJob,
        fail_print_job: failPrintJob,
        print_jobs: student.print_job.map((job) => ({
          id: job.id,
          filename: job.filename,
          time: job.time,
          printer_name: job.printer?.name || null, // Lấy `printer_name` từ liên kết
          page: job.page,
          copy: job.copy,
          page_size: job.page_size,
          two_side: job.two_side,
          color: job.color,
          status: job.status,
        })),
      },
    };
  }
}
