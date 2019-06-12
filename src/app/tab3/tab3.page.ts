import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CuartosPage } from '../cuartos/cuartos.page';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, ToastController, IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  usuario:string
  favoritos:Observable<any[]>
  fav:Observable<any[]>
  contador:number[]
  deleteFav:Observable<any>
  slideOpts = {
    effect: 'flip',
    loop: true,
    speed: 1500
  };
  constructor(public afDB: AngularFireDatabase, public alertCtrl: AlertController, 
    public toastCtrl:ToastController, public modalController: ModalController){
    localStorage.getItem('usuario') == null ? this.usuario = "usuario-usuario" : this.usuario = localStorage.getItem('usuario')
    this.favoritos = afDB.list(`registro/${this.usuario}/DatosPersonales/Favoritos`).valueChanges()
    this.fav = afDB.list('cuartos/Suites').valueChanges()
    //this.fav = afDB.database.ref('registro').child('Juan Perez')
    //console.log(this.favoritos['Juan']);
    //this.fav = afDB.list('favoritos/Suit Nº 23').valueChanges()
    //console.log(afDB.database.ref('favoritos').child('Suit Nº 23').child('guardados'))
    //console.log(afDB.database.ref('favoritos').orderByChild('Suit Nº 23').equalTo('guardados'));
    //afDB.database.ref('').child('').    
    //console.log(this.getContador());
    //this.exits()
  }
  async showMsm(message, duration, color, position) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color, 
      position, mode: 'ios'
    });
    toast.present();
  }
  autoPlay(slides:IonSlides){
    slides.startAutoplay()
  }
  async messageDeleteFav(header, message, textbtn1, textbtn2, cuarto:any) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      mode: 'ios',
      buttons: [  
        {
          text: textbtn1,
          handler: ()=>{
          }
        },
        {
          text: textbtn2,
          handler: ()=>{
            this.deleteFavorito(cuarto)
            this.showMsm('Eliminado de Favoritos', 1500, 'danger', 'top')
          }
        }
    ]
    });
  
    await alert.present();
  }
  deleteFavorito(cuarto:any){
    this.afDB.database.ref(`registro/${this.usuario}/DatosPersonales/Favoritos/${cuarto}`).remove()
    this.afDB.database.ref(`registro/${this.usuario}/Favoritos/${cuarto}`).remove()
  }
  exits(){
   this.afDB.database.ref('registro').child('Juan Rosales').child('Favoritos').child('Suit Nº 25')
   .on('value', function(snapshot){
      if(snapshot.exists()){
        console.log("La Suit Nº 25 Existe!!");
      }
      else{
        console.log("No Existe");
      }
    })
  }
  add(){
    //this.afDB.object('/favoritos/Suit Nº 23').valueChanges().subscribe(
     // data => {
      //  let count = parseInt(JSON.stringify(data['guardados']))
      //  let sumar = count+1 
      //  console.log(sumar);
     // }
   // )}
    let valor:number = 0
    this.afDB.database.ref('favoritos').child('Suit Nº 23').on('value', function(snapshot){
      valor = parseInt(JSON.stringify(snapshot.val()['guardados']))
    })
    this.afDB.object('/favoritos/Suit Nº 23').update({
      guardados: valor+1
    })
  }
  async cuartoModal(object:any) {
    const modal = await this.modalController.create({
    component: CuartosPage,
    componentProps: {valor : object}
    });
  
    await modal.present();
  
  }
}
