import { ConImageResponse } from "../Responsemodel/ConImageResponse";

export class ConImageResponseWithIDCont {
    idCont: number;
    listData: ConImageResponse[];
    constructor(idCont: number, listData: ConImageResponse[]) {
        this.idCont = idCont;
        this.listData = listData;
    }
}