import { Component } from '@angular/core';
import { RegistroService } from '../services/registro.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController, LoadingController, AlertController, ToastController, IonSlides } from '@ionic/angular';
import { RegistroPage } from "../registro/registro.page";
import { CuartosPage } from '../cuartos/cuartos.page';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  titulo:string
  precio:string = ""
  username:string = ""
  //userStorage:string = ""
  matrimoniales:Observable<any[]>
  suites:Observable<any[]>
  familiares:Observable<any[]>
  dobles:Observable<any[]>
  disponibles:Observable<any[]>
  ocupados:Observable<any[]>
  estadoRoom:string
  slideOpts = {
    effect: 'flip',
    loop: true,
    speed: 1500
  };
  //cuartosObject:any[] = []
  constructor(public modalController: ModalController,public afDB: AngularFireDatabase,
    public usuarioService: UsuarioService, public toastController: ToastController,
    public loadingController: LoadingController, public alertController: AlertController) {
    this.todosCuartos()
    localStorage.getItem('usuario') == null ? this.username = "usuario-usuario".split('-')[0] : this.username = localStorage.getItem('usuario').split('-')[0]
    /*if(localStorage.getItem('usuario') == null){
      this.username = "usuario-usuario".split('-')[0]
    }
    else{
      let userStorage = localStorage.getItem('usuario').split('-')
      this.username = userStorage[0]
    }*/
  }
  autoPlay(slides:IonSlides){
    slides.startAutoplay()
  }
  getUsername(){
    for (let index = 0; index < 500; index++) {
      setTimeout(() => {
        //this.username = localStorage.getItem('usuario')
      }, 1000);
    }
  }
  todosCuartos(){
    this.matrimoniales = this.afDB.list('cuartos/Matrimoniales').valueChanges()
    this.suites = this.afDB.list('cuartos/Suites').valueChanges()
    this.familiares = this.afDB.list('cuartos/Familiares').valueChanges()
    this.dobles = this.afDB.list('cuartos/Dobles').valueChanges()
    this.disponibles = this.afDB.list('disponibles').valueChanges()
    this.ocupados = this.afDB.list('ocupados').valueChanges()
    //this.matrimoniales.push(this.agrupar(this.matrimonialess, 2))
    //this.dobles.push(this.agrupar(this.dobless, 2))
    //this.familiares.push(this.agrupar(this.familiaress, 2))
    //this.suites.push(this.agrupar(this.suitess, 2))
  }
  validarEstado(estado:any){
    //this.suites = this.afDB.list('cuartos/Suites').valueChanges()
    //console.log(estado);
    
  }
  async cuartoModal(object:any) {
    const modal = await this.modalController.create({
    component: CuartosPage,
    componentProps: {valor : object}
    });
  
    await modal.present();
  
  }
  saveRoom(categoria, descrip, detalle1, detalle2, detalle3, estado, favoritos, 
    imgPrincipal, imgScroll1, imgScroll2, imgScroll3, imgScroll4, llegada, 
    medidaCama,
      medidaCuarto,
      precio24h,
      precioTotal,
      salida,titulo:string){
    this.afDB.object(`/disponibles/${titulo}`).set({
      categoria ,
      descrip ,
      detalle1 ,
      detalle2 ,
      detalle3 ,
      estado ,
      favoritos ,
      imgPrincipal ,
      imgScroll1 ,
      imgScroll2 ,
      imgScroll3 ,
      imgScroll4 ,
      llegada ,
      medidaCama,
      medidaCuarto,
      precio24h,
      precioTotal,
      salida,
      titulo,
    })
  }

  roomObject(estado:string){
    this.estadoRoom = estado
  }
  agrupar(array:any, tama:number){
    let newArray = []
    for(let i=0; i<array.length; i+=tama){
      newArray.push(array.slice(i, i+tama))
      console.log(newArray);
      
      return newArray
    }
  }

  async showMsm(message, duration, color) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      mode: 'ios',
      translucent: true
    });
    toast.present();
  }
  async verificarUsuario(name:string, clave:string) {
    this.usuarioService.verificarUser(name, clave).then((existe)=>{
      if(existe){
        this.showMsm(`Bienvenido ${name}`, 2000, 'success')
        this.username = localStorage.getItem('usuario').split('-')[0]
        window.location.reload();
      }
      else{
        this.presentAlert('Usuario Incorrecto', '', 'Intente de Nuevo o Regístrese')
      }
    })
    const loading = await this.loadingController.create({
      spinner: 'lines',
      duration: 2000,
      message: 'Verificando ...',
      mode: 'ios',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  async presentAlert(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      mode: 'ios',
      buttons: ['OK']
    });

    await alert.present();
  }

  async iniciarSesion() {
    const alert = await this.alertController.create({
      header: 'Iniciar Sesion',
      cssClass: 'alertLogin',
      mode: 'ios',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre'
        },
        {
          name: 'clave',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Aceptar',
          handler: (text) => {
            if(text['nombre'] == "" && text['clave'] == ""){
              this.presentAlert('Error', '', 'Falta Nombre o Contraseña')
              //console.log(text);
            }
            else{
              //console.log(text);
              this.verificarUsuario(text.nombre, text.clave)
            }
          }
        }
      ]
    });

    await alert.present();
  }

  detalles(object:any){
    this.titulo = object['titulo']
    this.precio = object['precio24h']
    //this.showDetalle = true
  }  

}
