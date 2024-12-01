import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async login(username: string, password: string) {
    // Tìm user dựa vào username và password
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.role === 'spso') {
      // Nếu role là spso, trả về uid và role
      return {
        uid: user.uid,
        role: user.role,
      };
    } else if (user.role === 'student') {
      // Nếu role là student, lấy thêm mssv, page_size và 3 print_job gần nhất
      const printJobCount = await this.prisma.print_job.count({
        where: { student_id: user.uid },
      });

      const progressPrintJob = await this.prisma.print_job.count({
        where: {
          student_id: user.uid,
          status: 'progress',
        },
      });

      const successPrintJob = await this.prisma.print_job.count({
        where: {
          student_id: user.uid,
          status: 'success',
        },
      });
      const failPrintJob = printJobCount - progressPrintJob - successPrintJob

      const pageSize = await this.prisma.student_page_size.findMany({
        where: { student_id: user.uid },
        select: {
          page_size: true,  
          current_page: true,
        },
      });

      const recentPrintJobs = await this.prisma.print_job.findMany({
        where: { student_id: user.uid },
        orderBy: { time: 'desc' },
        take: 3,
        select: {
          id: true,
          printer_id: true,
          filename: true,
          time: true,
          page: true,
          copy: true,
          page_size: true,
          two_side: true,
          color: true,
          status: true,
        },
      });

      return {
        uid: user.uid,
        username: user.username,
        password: user.password,
        role: user.role,
        mssv: user.mssv,
        print_job_count: printJobCount,
        page_size: pageSize,
        recent_print_jobs: recentPrintJobs,
        progress_print_job: progressPrintJob,
        success_print_job: successPrintJob,
        fail_print_job: failPrintJob,
      };
    } else {
      throw new UnauthorizedException('Unsupported role');
    }
  }

  async buyPage(
    uid: string,
    pageSize: string,
    page: number,
  ): Promise<{ status: string }> {
    // Tìm kiếm student_page_size theo UID và khổ giấy
    const studentPageSize = await this.prisma.student_page_size.findUnique({
      where: {
        student_id_page_size: {
          student_id: uid,
          page_size: pageSize,
        },
      },
    });

    // Nếu không tồn tại, tạo mới
    if (!studentPageSize) {
      await this.prisma.student_page_size.create({
        data: {
          student_id: uid,
          page_size: pageSize,
          current_page: page,
        },
      });
    } else {
      // Nếu tồn tại, cập nhật số lượng trang
      await this.prisma.student_page_size.update({
        where: {
          student_id_page_size: {
            student_id: uid,
            page_size: pageSize,
          },
        },
        data: {
          current_page: studentPageSize.current_page + page,
        },
      });
    }

    return { status: 'success' };
  }

  async getStudentActivities(spso_id: string): Promise<{
    status: string;
    message: string;
    data?: any[];
  }> {
    // Kiểm tra `spso_id` có tồn tại và role có đúng không
    const spso = await this.prisma.user.findUnique({
      where: { uid: spso_id },
    });
  
    if (!spso) {
      return { status: 'unsuccess', message: 'SPSO ID không tồn tại' };
    }
  
    if (spso.role !== 'spso') {
      return { status: 'unsuccess', message: 'Người dùng không có quyền truy cập' };
    }
  
    // Truy vấn danh sách student
    const students = await this.prisma.user.findMany({
      where: { role: 'student' },
      include: {
        page_size: true, // Lấy thông tin số trang theo từng khổ giấy
        print_job: true, // Lấy danh sách print_job
      },
    });
  
    // Xử lý dữ liệu
    const data = students.map((student) => {
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
  
      return {
        name: student.name,
        mssv: student.mssv || null,
        total_page: totalPage,
        total_print_job: totalPrintJob,
        progress_print_job: progressPrintJob,
        success_print_job: successPrintJob,
        fail_print_job: failPrintJob,
      };
    });
  
    return {
      status: 'success',
      message: 'Thành công',
      data,
    };
  }
  
}
