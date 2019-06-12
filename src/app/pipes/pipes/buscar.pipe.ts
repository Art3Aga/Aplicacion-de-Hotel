import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarDato'
})
export class BuscarPipe implements PipeTransform {

  transform(arreglo: any[], texto:string): any[] {
    console.log(arreglo);
    
    if(texto == ''){
      return arreglo
    }
    //texto = texto.toLowerCase()

    arreglo.filter(item =>{
      return item.titulo.includes(texto)
    });
    
    return arreglo
  }

}
