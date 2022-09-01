
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/clases/material.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup| any
  aSub!: Subscription // Esta clase nos sirve para optimizar y para que no se escape flujo de memoria

  constructor(
    private auth: AuthService,
    private router: Router, // Inyeccion de estos services Nos sirven para decir al subscribe del exito, podremos navegar por la app
    private route: ActivatedRoute // Contiene la informacion de route presencial
    ) {

   }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null,[Validators.required, Validators.minLength(6)])
    })
      this.route.queryParams.subscribe((params: Params)=>{
        if(params['registered']){
          MaterialService.toast('Ya puede entrar en el sistema utilizando sus datos')
          // Ya puede entrar en el sistema utilizando sus datos
        }else if(params['accessDenied']){
          MaterialService.toast('Hay que autorizarse primero en el sistema')
          // Hay que autorizarse primero en el sistema
        }else if(params['sessionExpired']){
          MaterialService.toast('Sesion se ha expirado, vuelve a entrar por favor')
        }
        //
      })

  }


  // Este metodo nos permite destruir el componente despues de pasar a otra pagina
  ngOnDestroy(): void {
    if(this.aSub){
      this.aSub.unsubscribe()
    }

  }


  onSubmit(){
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/overview']), //
      error: (e) => {MaterialService.toast(e.error.message), this.form.enable()},
      complete: () => console.info('complete')

    })



  }

}
