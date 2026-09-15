export class CommonResponseModal<T> {
  message: string;
  status: string;
  data: T;
  listData: T[];

  constructor(message: string, status: string, data: T, listData: T[]) {
    this.message = message;
    this.status = status;
    this.data = data;
    this.listData = listData;
  }
}
