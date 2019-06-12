import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'm'
})
export class MPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
