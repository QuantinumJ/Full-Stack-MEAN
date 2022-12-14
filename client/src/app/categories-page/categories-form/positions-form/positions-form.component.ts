import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from 'src/app/shared/clases/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy  {
  @Input('categoryId') categoryId!: string;
  @ViewChild('modal') modalRef!: ElementRef
  positions: Position[] = [];
  loading = false;
  modal!: MaterialInstance;
  form: FormGroup | any;
  positionId : null | any;

  constructor( private positionService: PositionsService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    this.positionService.fetch(this.categoryId).subscribe(positions=>{
      this.positions = positions
      this.loading=false
    })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)


  }
  ngOnDestroy(): void {
      this.modal.destroy
  }

  onSelectPosition(position: Position){
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open!()
    MaterialService.updateTextInputs()
  }
  onAddPosition(){
    this.positionId = null
    this.form.reset({
      name: null,
      cost: 1
    })
    this.modal.open!()
    MaterialService.updateTextInputs()

  }
  oncancel(){
    this.modal.close!()
  }

  onSubmit(){
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () =>{
      this.modal.close!()
      this.form.reset({
        name: '', cost:1
      })
      this.form.enable()
    }

    if(this.positionId){
      newPosition._id = this.positionId
      this.positionService.update(newPosition).subscribe({
        next: (position)=>{
            const idx = this.positions.findIndex( p => p._id === position._id)

            this.positions[idx]= position
           MaterialService.toast('La posicion se ha modificado correctamente')
         },
         error: (error) =>{
           MaterialService.toast(error.error.message);
         },
         complete:()=>{
         completed()
         }
       }
       )

    }else{
      this.positionService.create(newPosition).subscribe({
        next: (position)=>{
           MaterialService.toast('La posicion se ha creado correctamente')
           this.positions.push(position)
         },
         error: (error) =>{
           MaterialService.toast(error.error.message);
         },
         complete:()=>{
          completed()
         }
       }
       )
    }



  }
  onDeletePosition(event: Event,position: Position){
    event.stopPropagation
    const decision = window.confirm(`?? Borar esta posicion ${position.name}?`)
    if(decision){
      this.positionService.delete(position).subscribe({
        next: (response)=>{
          const idx = this.positions.findIndex(p => p._id ===position._id)
          this.positions.splice(idx,1)
          MaterialService.toast(response.message)
        },
        error:(e)=>{
          MaterialService.toast(e.error.message)
        }
      }

      )
    }
  }

}
