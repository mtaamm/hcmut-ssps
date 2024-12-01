export interface PageSize {
  page_size: string;
  current_page: number;
}

export interface Printer {
  name: string;
  machine_type: string;
  floor: number;
  building: string;
  two_side: boolean;
  color: boolean;
  page_size: PageSize[];
}

export interface CreatePrinterParam {
  uid: string;
  printer: Printer;
}
