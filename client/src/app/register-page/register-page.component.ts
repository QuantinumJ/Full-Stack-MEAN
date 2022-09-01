import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/clases/material.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit,OnDestroy {

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
          MaterialService.toast('Bienvendido al equipo!! Ya puede entrar en el sistema utilizando sus datos')
          // Ya puede entrar en el sistema utilizando sus datos
        }else if(params['accessDenied']){
          MaterialService.toast(' Por favor,  hay que autorizarse')
          // Hay que autorizarse primero en el sistema
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
    this.aSub = this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/login'],{
        queryParams: {
          registered : true
        }
      }),
      error: (e) => {MaterialService.toast(e.error.message), this.form.enable()},
      complete: () => console.info('complete')

    })



  }

}




