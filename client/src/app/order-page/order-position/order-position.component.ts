import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/clases/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-position',
  templateUrl: './order-position.component.html',
  styleUrls: ['./order-position.component.css']
})
export class OrderPositionComponent implements OnInit {

  positions$?: Observable<Position[]>

  constructor( private route: ActivatedRoute,
               private positionsService: PositionsService,
               private orderService: OrderService ) { }

  ngOnInit(): void {

    this.positions$ = this.route.params
    .pipe(
      switchMap(
          (params: Params)=>{
            return this.positionsService.fetch(params['id'])
          }
        ),
        map(
          (positions:Position[])=>{
            return positions.map(position =>{
              position.quantity = 1
              return position
            })
          }
        )
      )

  }
  addToOrder(position: Position){
    MaterialService.toast(`Añadido x${position.quantity}`)
    this.orderService.add(position)

  }

}
