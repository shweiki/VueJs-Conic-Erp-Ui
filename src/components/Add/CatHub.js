import { HubConnectionBuilder } from "@/microsoft/signalr"
class CatHub {
    constructor(){
    this.client = new HubConnectionBuilder ()
    .withUrl("/Classifications/Menu-Item")}
}