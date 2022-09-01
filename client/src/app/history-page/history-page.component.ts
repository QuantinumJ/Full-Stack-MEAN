import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/clases/material.service';
import { Filter, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';


const STEP = 4

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})


export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit{
// Con el decorador viewChild accedemos a la variable local del dom
@ViewChild('tooltip') tooltipRef!: ElementRef

  isFilterVisible = false
  oSub!: Subscription
  tooltip!: MaterialInstance
  orders: Order[]=[]
  filter: Filter = {}


  loading = false
  reloading = false
  noMoreOrders = false
  offset = 0
  limit = STEP


  constructor(private orderSService: OrdersService) { }

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }
  private fetch(){

    const params = Object.assign({}, this.filter, {
        offset: this.offset,
        limit: this.limit
      })

    this.oSub = this.orderSService.fetch(params).subscribe(orders=>{
      this.orders = this.orders.concat(orders)
      this.noMoreOrders = orders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }
  applyFilter(filter: Filter ){
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
    }

  loadMore(){
    this.offset +=STEP
    this.loading = true
    this.fetch()
  }

  ngAfterViewInit(): void {
   this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }
  isFiltered() : boolean{
    return Object.keys(this.filter).length !==0
  }



  ngOnDestroy(): void {
  this.tooltip.destroy!()
  this.oSub.unsubscribe()
  }


}
