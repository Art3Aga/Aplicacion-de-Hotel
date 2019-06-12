import { ReservarPage } from './../reservar/reservar.page';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { ToastController, ModalController, IonSlides, AlertController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-cuartos',
  templateUrl: './cuartos.page.html',
  styleUrls: ['./cuartos.page.scss'],
})
export class CuartosPage implements OnInit {
  @Input() valor:Observable<any>
  usuarioStorage:string = ""
  servicios:any[] = []
  cuartos:Observable<any>
  contadorFavoritos:number = 1
  room:Observable<any>
  comentario:string = ""
  slideOpts = {
    effect: 'flip',
    loop: true,
    speed: 1500
  };
  constructor(public afDB: AngularFireDatabase, public toastCtrl: ToastController, 
    public modalCtrl: ModalController, private router: Router, public alertController: AlertController) { 
      localStorage.getItem('usuario') == null ? this.usuarioStorage = "usuario-usuario" : this.usuarioStorage = localStorage.getItem('usuario')
  }

  ngOnInit() {
    this.cuartos = this.valor
    console.log(this.valor);
    //this.servicios = this.afDB.object('cuartos/').valueChanges()
    
  }
  autoPlay(slides:IonSlides){
    slides.startAutoplay()
  }
  publicar(){
    console.log(this.comentario);
  }
  closeModal(){
    this.modalCtrl.dismiss()
  }

  async reservarModal(object:any) {
    const modal = await this.modalCtrl.create({
    component: ReservarPage,
    componentProps: {valor : object},
    mode: 'ios'
    });
  
    await modal.present();
  
  }
  openReservacion(object:any){
    if(this.usuarioStorage == "usuario-usuario"){
      this.presentAlert('¡No Registrado!', 'Diríjase al apartado de "Registro"', 'Debe estar Registrado para Poder Reservar')
    }
    else{
      let navegar: NavigationExtras = {
        state:{
          valor: object
        }
      };
      this.router.navigate(['reservar'], navegar);
      this.closeModal()
    }
  }
  openRegistro(){
    this.router.navigate(['registro']);
    this.closeModal()
  }

  existe(){
    let data = this.afDB.database.ref('favoritos').child(`${this.cuartos['titulo']}`).on('value', function(snapshot){
      parseInt(JSON.stringify(snapshot.val()['guardados']))
    })
  }

  addFavoritos(object:any){

    if(this.usuarioStorage == "usuario-usuario"){
      this.presentAlert('¡No Registrado!', 'Diríjase al apartado de "Registro"', 'Debe estar Registrado para agregar a Favoritos')
    }
    else{
      let likes:number = parseInt(JSON.stringify(this.cuartos['favoritos']))
        let colectFavCount = this.afDB.object(`/cuartos/${this.cuartos['categoria']}/${this.cuartos['titulo']}`).update({
          favoritos: likes + 1
        })
        let colectFavCount2 = this.afDB.object(`/disponibles/${this.cuartos['titulo']}`).update({
          favoritos: likes + 1
        })
        let colecFavUser = this.afDB.object(`/registro/${this.usuarioStorage}/Favoritos/${this.cuartos['titulo']}`).update(object)
        let colectFavUser2 = this.afDB.object(`/registro/${this.usuarioStorage}/DatosPersonales/Favoritos/${this.cuartos['titulo']}`).update(object)
        if(colecFavUser && colectFavCount && colectFavCount2 && colectFavUser2){
          this.showMessage('Agregado a Favoritos', 2000, 'success')
        }
    }
    
    //let valor:number
    //let existe:boolean
    //let cF:any = {}
    //let existFav = this.afDB.database.ref('favoritos').child(`${this.cuartos['titulo']}`)
    //.on('value', function(snapshot){
   // })
    //this.afDB.database.ref('favoritos').child(`${this.cuartos['titulo']}`).child('favoritos').on('value', function(snapshot){
      //valor = parseInt(JSON.stringify(snapshot.val()['guardados']))
    //})
    //let saveFavCount = this.afDB.object(`/favoritos/${this.cuartos['titulo']}`).update({
      //favoritos: valor = valor + 1
   // })
    
    //this.afDB.database.ref('favoritos').child(`${this.cuartos['titulo']}`).on('value', function(sanpshot){
      //existe = sanpshot.exists()
   // })
    //let existFav = this.afDB.database.ref('registro').child('Juan Rosales').child('Favoritos').child(`${this.cuartos['titulo']}`)
    //.on('value', function(snapshot){})
    //if(!valor){
      //this.afDB.object(`/favoritos/${this.cuartos['titulo']}`).update({
        //guardados: 1
     // })
    //}
    //else{
      //this.afDB.object(`/favoritos/${this.cuartos['titulo']}`).update({
        //guardados: valor+=1
     // })
   // }
    
    
  }

  async presentAlert(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: 'Ir a Registro', 
          handler: ()=>{
            this.openRegistro()
          }
        }, 
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async cancel(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      mode: 'ios',
      buttons: [ 
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si', 
          handler: ()=>{
            this.comentario = ""
          }
        },
      ]
    });

    await alert.present();
  }

  async showMessage(message, duration, color){
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      mode: 'ios', 
      position: 'top',
    });
    toast.present();
  }

}
