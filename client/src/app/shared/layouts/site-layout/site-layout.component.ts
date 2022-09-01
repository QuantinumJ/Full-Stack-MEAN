import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from '../../clases/material.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements  AfterViewInit {
  // La directiva nos sirve para inicializar elementos del DOM
  @ViewChild('floating')floatingRef!: ElementRef;

  links = [
    {url: '/overview', name: 'Revision'},
    {url: '/analytics', name: 'Analitica'},
    {url: '/history', name: 'Historial'},
    {url: '/order', name: 'Añadir pedido'},
    {url: '/categories', name: 'Surtido'},
    // {url: '/overview', name: 'Salir'}
  ]

  constructor(private auth: AuthService,
              private router: Router) { }


  logout(event: Event){
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login'])

  }
  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef)
  }
}
