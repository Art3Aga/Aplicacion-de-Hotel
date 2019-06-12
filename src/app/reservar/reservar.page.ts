import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalController, IonSlides, AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
})
export class ReservarPage implements OnInit {
  //@Input() valor:Observable<any>
  valor: any
  //variables para reservar cuarto
  dui:string = ""
  tel:string = ""
  dir:string = ""
  fechIn:string = ""
  fechFin:string = ""
  hourIn:string = ""
  hourFin:string = ""
  usuarioStorage:string = ""
  estado:string = ""
  slideOpts = {
    effect: 'flip',
    loop: true,
    speed: 1500
  };
  constructor(public modalCtrl: ModalController, private route: ActivatedRoute, private router: Router,
    public afDB:AngularFireDatabase, public alertController: AlertController,public toastController: ToastController) {
    this.route.queryParams.subscribe((parametro)=>{
      if(this.router.getCurrentNavigation().extras.state){
        this.valor = this.router.getCurrentNavigation().extras.state.valor;
      }
    })
  }

  ngOnInit() {
    this.getDate()
    localStorage.getItem('usuario') == null ? this.usuarioStorage = "usuario-usuario" : this.usuarioStorage = localStorage.getItem('usuario')
  }
  getDate():string {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //Enero es 0
    let yyyy = today.getFullYear();
    let hoy:string = dd + '/' + mm + '/' + yyyy;
    return hoy
  }

  roomPedidoDetalle(dui:string, tel:string, dir:string, fechaIn:string,
    fechaFin:string, hourIn:string, hourFin:string, cuartoReservado:string){
      if(dui == null || tel == "" || dir == "" || fechaIn == ""|| fechaFin == "" || hourIn == "" || hourFin =="" || cuartoReservado == ""){
        this.presentAlert3('Falta de Datos', '', 'Debe Ingresar todos los datos requeridos')
      }
      else{
        this.presentAlert('¿Seguro?', '', '¿Desea Realizar esta Reservacion?', dui, tel, dir, fechaIn, 
        fechaFin, hourIn, hourFin, cuartoReservado)
      }
  }
  closeModal(){
    this.modalCtrl.dismiss()
  }
  autoPlay(slides:IonSlides){
    slides.startAutoplay()
  }
  async presentAlert(header, subHeader, message, dui:string, tel:string, dir:string, fechaIn:string,
    fechaFin:string, hourIn:string, hourFin:string, cuartoReservado:string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      mode: 'ios',
      buttons: 
      [
        {
          text: 'Aceptar',
          handler: ()=>{
            let reservarDetalle = this.afDB.object(`/reservacionDetalle/${this.usuarioStorage}/${this.valor['titulo']}`)
            .update({
              dui, tel, dir, fechaIn, fechaFin, hourIn, hourFin, cuartoReservado, 
              fechaPeticion: this.getDate(), nombre: this.usuarioStorage.split('-')[0]
            })
            let reservarEstado = this.afDB.object(`/cuartos/${this.valor['categoria']}/${this.valor['titulo']}`).update({
              estado: "Ocupado"
            })
            let removeDisponibles = this.afDB.database.ref(`disponibles/${this.valor['titulo']}`).remove()
            
            let setOcupados = this.afDB.object(`/ocupados/${this.valor['titulo']}`).set({
              categoria: this.valor['categoria'],
              descrip: this.valor['descrip'],
              detalle1: this.valor['detalle1'],
              detalle2: this.valor['detalle2'],
              detalle3: this.valor['detalle3'],
              estado: "Ocupado",
              favoritos: this.valor['favoritos'],
              imgPrincipal: this.valor['imgPrincipal'],
              imgScroll1: this.valor['imgScroll1'],
              imgScroll2: this.valor['imgScroll2'],
              imgScroll3: this.valor['imgScroll3'],
              imgScroll4: this.valor['imgScroll4'],
              llegada: `${fechaIn}-${hourIn}`,
              medidaCama: this.valor['medidaCama'],
              medidaCuarto: this.valor['medidaCuarto'],
              precio24h: this.valor['precio24h'],
              precioTotal: this.valor['precioTotal'],
              salida: `${fechaFin}-${hourFin}`,
              titulo: this.valor['titulo'],
            })
            
            if(reservarDetalle && reservarEstado && setOcupados && removeDisponibles){
              this.presentAlert2('¡Reservacion Realizada!', '', `Se ha reservado: "${this.valor['titulo']}"\nA nombre de: ${this.usuarioStorage.split('-')[0]}.
              \nIniciando: ${this.fechIn} a las ${this.hourIn}\ny Finalizando: ${this.fechFin} a las ${this.hourFin}`)
              this.showMsm(`${this.usuarioStorage}, tu reservacion se ha realizado`, 2000, 'success')
            }
            else{
              this.presentAlert2('Error', '', 'Error al Enviar los Datos\nCompruebe la conexion a Internet')
            }
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
  async presentAlert2(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      mode: 'ios',
      buttons: [{text: 'Ok', handler: ()=>{this.openPage()}}]
    });

    await alert.present();
  }
  async presentAlert3(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      mode: 'ios',
      buttons: [{text: 'Ok'}]
    });

    await alert.present();
  }
  openPage(){
    this.router.navigate(['/']);
  }
  async showMsm(message, duration, color) {
    let toast = await this.toastController.create({
      message,
      duration,
      color,
      mode: 'ios',
    });
    toast.present();
  }

}
