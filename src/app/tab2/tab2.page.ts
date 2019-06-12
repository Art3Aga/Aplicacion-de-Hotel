import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  opcionesSlide = {
    allowSlideNext: false,
    allowSlidePrev: false
  };
  categorias:Observable<any[]>
  items:any
  input = ""
  categ:any[] = []
  busquedas:any[] = []
  constructor(public afDB: AngularFireDatabase, public navCtrl: NavController){
    //this.items = this.searchCategoria(this.input)
    //this.items = this.buscar(this.input)
    //console.log("Items: " + this.items);
    
    //this.categorias = afDB.list('categorias').valueChanges()
    this.categ = [
      {
        titulo: 'Suites',
        img: 'https://r-ec.bstatic.com/images/hotel/max1024x768/654/65445918.jpg'
      },
      {
        titulo: 'Dobles',
        img: 'https://media-cdn.tripadvisor.com/media/photo-s/08/5d/dc/0e/deluxe-auto-hotel.jpg'
      },
      {
        titulo: 'Matrimoniales',
        img: 'https://media-cdn.tripadvisor.com/media/photo-s/02/20/3d/55/habitacion-doble.jpg'
      },
      {
        titulo: 'Familiares',
        img: 'https://foto.hrsstatic.com/fotos/0/3/694/390/80/000000/http%3A%2F%2Ffoto-origin.hrsstatic.com%2Ffoto%2F0%2F1%2F0%2F9%2F%2Fteaser_010909.jpg/6w0Dgkm2Dbg0I6MkGpI6jw%3D%3D/3543,2365/6/Catalonia_Atenas-Barcelona-Familienzimmer-1-10909.jpg'
      }
    ]
  }

  nextPage(valor:any){
    this.navCtrl.navigateBack(`/categorias/${valor}`)
  }
  searchCategoria(texto:string){
    return this.categ.filter((item)=>{
      return item['titulo'].toUpperCase().indexOf(texto) > -1;
    })
  }
  buscar(texto:string){
    this.categ.find((item)=>{
      let dato:string = item['titulo']
      return item['titulo'].match(texto)
    })
  }

  search(event){
    //console.log(event);
    this.input = event.detail.value
    console.log(event.detail.value);
    
    
  }
}
