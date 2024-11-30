import axiosClient from "./axiosClient";

// Types
export interface PrintHistory {
  id: string;
  filename: string;
  time: string;
  printer_name: string;
  printer_floor: string;
  printer_buiding: string;
  page: number;
  copy: number;
  status: "progress" | "success" | "fail";
}

export interface MatchPrinter {
  id: string
  name: string
  floor: string
  building: string
}

export interface CreatePrintJobResponse {
  status: string
  message: string
}

let uid =""
const user = localStorage.getItem("user");
if (user) {
  const userData = JSON.parse(user)
  uid = userData.uid
} else {
  window.location.href = '/login'
}

export const studentAPI = {
  getPrintHistory: async() => {
    try {
      const respone: PrintHistory[] = await axiosClient.get('/print-job/get-print-history', {
        params: {
          uid: uid
        }
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  },  
  buyPage: async(page_size: string, page: number) => {
    try {
      const respone: {status: string} = await axiosClient.post('/user/buy-page', {
        uid: uid,
        page_size: page_size,
        page: page
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  },
  getMatchPrinters: async(page_size: string, page: number, copy: number, two_side: boolean, color: boolean) => {
    try {
      const respone: MatchPrinter[] = await axiosClient.post('printer/get-match-printers', {
        page_size: page_size,
        page: page,
        copy: copy,
        two_side: two_side,
        color: color
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  },
  createPrintJob: async(printer_id: string, filename: string, page_size: string, page: number, copy: number, two_side: boolean, color: boolean) => {
    try {
      const respone: CreatePrintJobResponse = await axiosClient.post('print-job/create-print-job', {
        printer_id: printer_id, student_id: uid, filename: filename, page_size: page_size, page: page, copy: copy, two_side: two_side, color: color
      })
      return respone
    } catch(error) {
      console.log(error)
    }
  }
}