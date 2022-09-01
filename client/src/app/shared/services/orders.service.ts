import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class OrdersService{
    constructor(private http: HttpClient){

    }
    create(order: Order): Observable<Order>{
      return this.http.post<Order>('/api/order',order)

    }
    // el parametro que podriamos pasar por el fech puede incluir paginacion y algunos filtros
    fetch(params: any={}):Observable<Order[]>{
      return this.http.get<Order[]>('/api/order', {
        // La clase Http params nos permite trabajar comodamente con las peticiones hhtp
        params: new HttpParams({
          fromObject: params
        })
      })
    }
}
