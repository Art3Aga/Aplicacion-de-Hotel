import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { BuscarPipe } from './buscar.pipe';

@NgModule({
  declarations: [BuscarPipe],
  exports: [BuscarPipe],
  /*imports: [
    CommonModule
  ]*/
})
export class PipesModule { }
