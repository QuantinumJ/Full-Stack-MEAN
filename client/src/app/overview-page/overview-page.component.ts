import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/clases/material.service';
import { OverviewPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})

//Para el Material necesistamos implimentar dos interfaces para su control
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit  {

  //Creamos el decorador para para seleccionar el elemnto del DOM
  @ViewChild('tapTarget') tapTargetRef!: ElementRef
  // Evento informativo
  tapTarget!: MaterialInstance
  data$!: Observable<OverviewPage>
  // Mostrar la fecha dinamicamente
  yesterday =  new Date()

  constructor(private analiticsService: AnalyticsService) { }

  ngOnInit(): void {

   this.data$ = this.analiticsService.getOverview()
   this.yesterday.setDate(this.yesterday.getDate()-1)
  }
  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }
  ngOnDestroy(): void {
      this.tapTarget.destroy!()
  }
  openInfo(){
    this.tapTarget.open!()
  }

}
