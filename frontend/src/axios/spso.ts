import axiosClient from "./axiosClient";

export interface PageSize {
  printer_id: string;
  page_size: string;
  current_page: number;
}


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
  page_size: PageSize[];
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
  edit: async(printer_id: string, page_size: PageSizeParam, floor: number, building: string) => {
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
}