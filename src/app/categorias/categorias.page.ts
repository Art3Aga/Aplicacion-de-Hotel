import { CuartosPage } from './../cuartos/cuartos.page';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AlertController, ToastController, ModalController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  matrimoniales:Observable<any[]>
  suites:Observable<any[]>
  familiares:Observable<any[]>
  dobles:Observable<any[]>
  mostrando:Observable<any[]>
  categor = null
  en_Uso = ""
  


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
  constructor(private activatedRoute: ActivatedRoute, public afDB: AngularFireDatabase,
     public alertCtrl: AlertController, 
    public toastCtrl:ToastController, public modalController: ModalController) { 
    this.categor = this.activatedRoute.snapshot.paramMap.get('id')
    localStorage.getItem('usuario') == null ? this.usuario = "usuario-usuario" : this.usuario = localStorage.getItem('usuario')
    this.favoritos = afDB.list(`registro/${this.usuario}/DatosPersonales/Favoritos`).valueChanges()
    this.fav = afDB.list('cuartos/Suites').valueChanges()
  }

  ngOnInit() {
    this.matrimoniales = this.afDB.list('cuartos/Matrimoniales').valueChanges()
    this.suites = this.afDB.list('cuartos/Suites').valueChanges()
    this.familiares = this.afDB.list('cuartos/Familiares').valueChanges()
    this.dobles = this.afDB.list('cuartos/Dobles').valueChanges()
    this.comprobarCategoria()
  }
  comprobarCategoria(){
    switch (this.categor) {
      case "Suites":
        this.en_Uso = "Suites"
        this.mostrando = this.suites
        break;
      case "Matrimoniales":
        this.en_Uso = "Matrimoniales"
        this.mostrando = this.matrimoniales
        break;
      case "Familiares":
        this.en_Uso = "Familiares"
        this.mostrando = this.familiares
        break;
      case "Dobles":
        this.en_Uso = "Dobles"
        this.mostrando = this.dobles
        break;
    
      default:
        break;
    }
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

  async cuartoModal(object:any) {
    const modal = await this.modalController.create({
    component: CuartosPage,
    componentProps: {valor : object}
    });
  
    await modal.present();
  
  }

}
