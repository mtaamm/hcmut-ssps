import axiosClient from "./axiosClient";

// Types
export interface PrintJob {
  id: string;
  printer_id: string;
  filename: string;
  time: string;
  page: number;
  copy: number;
  page_size: string;
  two_side: boolean;
  color: boolean;
  status: string;
}

export interface PageSize {
  page_size: string;
  current_page: number;
}

export interface Student {
  uid: string;
  role: string;
  mssv: number;
  print_job_count: number;
  page_size: PageSize[];
  recent_print_jobs: PrintJob[];
  progress_print_job: number;
  success_print_job: number;
  fail_print_job: number;
}

export const userAPI = {
  login: async(username: string, password: string) => {
    try {
      const respone: Student = await axiosClient.post('user/login', {
        username: username,
        password: password
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  }
}