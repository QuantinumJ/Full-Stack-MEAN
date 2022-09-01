import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {  Subscription } from 'rxjs';
import { AnaliticsPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';
import {Chart,registerables } from 'chart.js'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})

export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef!: ElementRef
  @ViewChild('order') orderRef!: ElementRef

  aSub!: Subscription
  averge!: number
  pending = true



  constructor(private analitica : AnalyticsService) {
    Chart.register(...registerables);
   }

ngAfterViewInit(): void {

  const gainConfig: any = {
    label: 'Ganacia',
    color: 'rgb(255, 99, 132)'
  }
  const orderConfig: any = {
    label: 'Pedidos',
    color: 'rgb(54, 162, 235)'
  }


  this.aSub = this.analitica.getAnalytics().subscribe((data: AnaliticsPage)=>{

    this.averge = data.average
    gainConfig.labels = data.chart.map(item=>{item.label})
    gainConfig.data = data.chart.map(item=>{item.gain})

    orderConfig.labels = data.chart.map(item=>{item.label})
    orderConfig.data = data.chart.map(item=>{item.order})

    // // *****Temp Ganancias******
    // gainConfig.data.push(2000)
    // gainConfig.labels.push('30.08.2022')
    // gainConfig.data.push(500)
    // gainConfig.labels.push('31.08.2022')
    // gainConfig.data.push(1500)
    // gainConfig.labels.push('31.08.2022')


    // // *****Temp Ganancias******

    // // *****Temp Pedidos******
    // orderConfig.labels.push('29.08.2022')
    // orderConfig.data.push(40)
    // orderConfig.labels.push('31.08.2022')
    // orderConfig.data.push(10)
    // orderConfig.labels.push('31.08.2022')
    // orderConfig.data.push(15)
    //     // *****Temp Pedidos******



    const gainContext = this.gainRef.nativeElement.getContext('2d')
    const orderContext = this.orderRef.nativeElement.getContext('2d')
    gainContext.canvas.height = '300px'
    orderContext.canvas.height = '300px'


    new Chart(gainContext,createChartConfig(gainConfig) as any);
    new Chart(orderContext,createChartConfig(orderConfig) as any);

    this.pending = false
  })
}
ngOnDestroy(): void {
  if(this.aSub)
    this.aSub.unsubscribe()
}
}

function createChartConfig({labels, data, label, color}:any){
  return {
   type: 'line' ,
   options: {
     responsive: true
   },
   data: {
      labels,
      datasets: [
       {
       label: label,
       data: data,
       borderColor : color,
       steppedLine: false,
       fill: false
      }
     ]
   }
  }
 }

