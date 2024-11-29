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
}
