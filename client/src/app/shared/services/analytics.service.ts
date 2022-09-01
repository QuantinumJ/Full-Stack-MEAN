import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AnaliticsPage, OverviewPage } from "../interfaces";

@Injectable({
  providedIn: 'root'
})

export class AnalyticsService{

  constructor(private http: HttpClient){}

  getOverview(): Observable<OverviewPage> {

    return this.http.get<OverviewPage>('/api/analyticas/overview')
  }

  getAnalytics(): Observable<AnaliticsPage> {

    return this.http.get<AnaliticsPage>('/api/analyticas/analyticas')
  }

}
