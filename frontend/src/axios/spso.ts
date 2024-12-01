import axiosClient from "./axiosClient";

export interface Printer {
  id: string;
  name: string;
  machine_type: string;
  time: string;
  floor: number;
  building: string;
  status: "enable" | "disable";
  two_side: boolean;
  color: boolean;
  page_size: PageSizeParam[];
}

export interface GetAllResponse {
  status: string
  message: string
  data: Printer[]
}
export interface PageSizeParam {
  page_size: string;
  current_page: number;
}

export interface PrinterParam {
  name: string;
  machine_type: string;
  floor: number;
  building: string;
  two_side: boolean;
  color: boolean;
  page_size: PageSizeParam[];
}

export interface PostResponse {
  status: string
  message: string
}

export interface PrintJob {
  id: string;
  filename: string;
  time: string;
  page: number;
  page_size: string;
  copy: number;
  status: "success" | "fail" | "progress";
  mssv: number;
  name: string;
}

export interface PrinterDetails {
  id: string;
  name: string;
  machine_type: string;
  floor: number;
  building: string;
  status: "enable" | "disable";
  two_side: boolean;
  color: boolean;
  page_size: PageSizeParam[];
  print_jobs: PrintJob[];
}

export interface GetPrinterDetailResponse {
  status: "success" | "unsuccess";
  message: string;
  data: PrinterDetails;
}

export interface StudentSummary {
  id: string
  name: string
  mssv: number
  total_page: number
  total_print_job: number
  progress_print_job: number
  success_print_job: number
  fail_print_job: number
}

export interface GetStudentSummaryResponse {
  status: "success" | "unsuccess";
  message: string;
  data: StudentSummary[]
}

export interface PrintJob {
  id: string;
  filename: string;
  printer_name: string;
  time: string;
  page: number;
  page_size: string;
  copy: number;
  status: "progress" | "success" | "fail";
}

export interface StudentDetails {
  name: string
  mssv: number
  total_page: number
  total_print_job: number
  progress_print_job: number
  success_print_job: number
  fail_print_job: number
  print_jobs: PrintJob[]
}

export interface GetStudentDetailResponse {
  status: "success" | "unsuccess";
  message: string;
  data: StudentDetails
}

let uid =""
const user = localStorage.getItem("user");
if (user) {
  const userData = JSON.parse(user)
  uid = userData.uid
} else {
  window.location.href = '/login'
}

export const spsoAPI = {
  getAll: async() => {
    try {
      const respone: GetAllResponse = await axiosClient.get('printer/get-all', {
        params: {uid:uid}
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  },
  create: async(printer: PrinterParam) => {
    try {
      const respone: PostResponse = await axiosClient.post('printer/create', {
        uid: uid,
        printer: printer
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  },
  edit: async(printer_id: string, page_size: PageSizeParam[], floor: number, building: string) => {
    try {
      const respone: PostResponse = await axiosClient.post('printer/edit', {
        uid: uid,
        printer_id: printer_id,
        page_size: page_size,
        floor: floor,
        building: building
      })
      return respone
    } catch (error) {
      console.log(error)
    }
  },
  toggleStatus: async(printer_id: string) => {
    try {
      const respone: PostResponse = await axiosClient.post('printer/toggle-status', {
        uid: uid,
        printer_id: printer_id
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  },
  delete: async(printer_id: string) => {
    try {
      const respone: PostResponse = await axiosClient.post('printer/delete', {
        uid: uid,
        printer_id: printer_id
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  },
  getPrinterDetail: async(printer_id: string) => {
    try {
      const respone: GetPrinterDetailResponse = await axiosClient.get('/printer/get-printer-detail', {
        params: {
          uid: uid,
          printer_id: printer_id
        }
      })
      return respone
    } catch (error) {
      console.log(error)
    }
  },
  getStudentSummary: async () => {
    try {
      const respone:GetStudentSummaryResponse = await axiosClient.get('user/get-student-activities', {
        params: {spso_id: uid}
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  },
  getStudentDetail: async (id: string) => {
    try {
      const respone: GetStudentDetailResponse = await axiosClient.get('print-job/get-student-history-spso', {
        params: {
          spso_id: uid,
          uid: id
        }
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  }
}