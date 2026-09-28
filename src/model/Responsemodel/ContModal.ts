export class ContModal {
  id: number;
  soBooking: string;
  soCont: string;
  soLuongAnh: number;
  nguoiKhaiBao: string;

  constructor(id: number, soBooking: string, soCont: string, soLuongAnh: number, nguoiKhaiBao: string) {
    this.id = id;
    this.soBooking = soBooking;
    this.soCont = soCont;
    this.soLuongAnh = soLuongAnh;
    this.nguoiKhaiBao = nguoiKhaiBao;
  }
}