export class ConImageResponse {
  id: number;
  iDCont: number;
  path: string;
  nguoiChup: string;
  thoiGianChup: string;
  
  constructor(id: number, iDCont: number, path: string, nguoiChup: string, thoiGianChup: string) {
    this.id = id;
    this.iDCont = iDCont;
    this.path = path;
    this.nguoiChup = nguoiChup;
    this.thoiGianChup = thoiGianChup;
  }
}