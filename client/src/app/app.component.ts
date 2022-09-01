import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',

})
export class AppComponent implements OnInit{
    constructor( private auth: AuthService){
    }

    ngOnInit(): void {
        const potencialToken = localStorage.getItem('auth-token')
        if(potencialToken !== null){
          this.auth.setToken(potencialToken)
        }

    }
}
