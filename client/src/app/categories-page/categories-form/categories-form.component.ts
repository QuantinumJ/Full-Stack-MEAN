import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MaterialService } from 'src/app/shared/clases/material.service';
import { Category } from 'src/app/shared/interfaces';
import { CategoriesService } from 'src/app/shared/services/categories.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') inputRef!: ElementRef
  form: FormGroup | any;
  image ?: File;
  imagePreview: ''| any;
  isNew = true;
  category: Category| any;

  constructor( private route: ActivatedRoute,
               private categoriesService: CategoriesService,
               private router: Router
    ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null,[Validators.required])
    })
    this.form.disable()

    this.route.params.pipe(
      switchMap((params: Params)=>{
        if(params['id']){
          this.isNew = false
          return this.categoriesService.getById(params['id'])
        }
        return of(null)
      })
    )
    .subscribe({
      next: (category) => {
        if(category){
          this.category = category
          this.form.patchValue({
            name: category.name
          })
          this.imagePreview = category.imageSrc
          MaterialService.updateTextInputs()
        }
        this.form.enable()
      },
      error: (error) => {MaterialService.toast(error.error.message)},
      complete: () => console.info('complete')



    })





    //   next: () => {   },
    //   error: () => MaterialService.toast(error.error.message)
    // )

  }
  deleteCategory(){
    const decision = window.confirm(` ¿Esta seguro, que quiere eliminar esta categoria? ${this.category.name} `)
    if(decision){
      this.categoriesService.delete(this.category._id)
      .subscribe({
        next: (response)=>{MaterialService.toast(response.message)},
        error: (error)=>{MaterialService.toast(error.error.message)},
        complete: ()=> {this.router.navigate(['/categories'])}
      }
      )
    }
  }

  triggerClick(){
    this.inputRef.nativeElement.click()
  }
  onFileUpload(event: any){
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload=()=>{
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }

  onSubmit(){
    let obs$
    this.form.disable()
    if(this.isNew){
      //create
      obs$ = this.categoriesService.create( this.form.value.name, this.image)
    }else{
      // update
      obs$ = this.categoriesService.update( this.category._id, this.form.value.name, this.image)
    }
    obs$.subscribe(
      {
        next: (category)=>{
          this.category= category
          MaterialService.toast('Los cambio se han guardado')
          this.form.enable()

        },
        error: (error)=>{
          MaterialService.toast(error.error.message)
          this.form.enable()
        },
        complete: () => console.info('complete')
      }
    )
  }


}
