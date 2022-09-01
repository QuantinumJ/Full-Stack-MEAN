import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root' // Sirve para registar el servicio
})

export class AuthGuard implements CanActivate, CanActivateChild{
  constructor( private auth: AuthService, // Nos sirve para verificar si el usuario actual si tiene el token
                private router: Router  // Nos va a permitir a redirigir al usuario si no esta logiado

    ){

  }

 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
     if(this.auth.isAuthenticated()){
      return of(true) // operador of nos permite crear observables
     }else{
      this.router.navigate(['/login'],{
        queryParams:{
          accessDenied : true
        }
      })
      return of(false)
     }
 }

 canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  return this.canActivate(childRoute,state)
 }


}
