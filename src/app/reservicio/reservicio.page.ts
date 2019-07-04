import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-reservicio',
  templateUrl: './reservicio.page.html',
  styleUrls: ['./reservicio.page.scss'],
})
export class ReservicioPage implements OnInit {
  @Input() valor:Observable<any>
  @Input() datosPersonales:Observable<any>
  servicio:Observable<any>
  /*dui:string = ""
  tel:string = ""
  dir:string = ""
  fechIn:string = ""
  fechFin:string = ""
  hourIn:string = ""
  hourFin:string = ""*/
  usuarioStorage:string = ""
  cantidad:string = ""
  canti:number = 0
  estado:string = ""
  total:number = 0
  //precio:number = parseInt(JSON.stringify(this.valor['precioU']))
  today = new Date()
  constructor(public modalCtrl: ModalController,public afDB:AngularFireDatabase, 
    public alertController: AlertController, public toastController: ToastController) { }

  ngOnInit() {
    //this.servicio = this.valor
    this.getDate()
    localStorage.getItem('usuario') == null ? this.usuarioStorage = "usuario-usuario" : this.usuarioStorage = localStorage.getItem('usuario')
    //this.total = parseInt(this.cantidad) * 5
    //this.canti = parseInt(this.cantidad)
    //this.precio = parseInt(JSON.stringify(this.valor['precioU']))
  }
  closeModal(){
    this.modalCtrl.dismiss()
  }
  getDate():string {
    
    let dd = String(this.today.getDate()).padStart(2, '0');
    let mm = String(this.today.getMonth() + 1).padStart(2, '0'); //Enero es 0
    let yyyy = this.today.getFullYear();
    let hoy:string = dd + '/' + mm + '/' + yyyy;
    return hoy
  }
  getTime():string{
    let horas = this.today.getHours()
    let minutos = this.today.getMinutes()
    let segundos = this.today.getSeconds()
    let tiempo = horas+":" + minutos+":" +segundos;
    return tiempo
  }
  roomPedidoDetalle(dui:string, tel:string, dir:string, fechaIn:string, hourIn:string,cuartoReservado:string){
      if(dui == null || tel == "" || dir == "" || fechaIn == ""|| hourIn == "" || cuartoReservado == "" || this.canti == 0){
        this.presentAlert3('Falta de Datos', '', 'Debe Ingresar todos los datos requeridos')
      }
      else{
        this.presentAlert('¿Seguro?', '', '¿Desea Realizar esta Reservacion?', dui, tel, dir, fechaIn, hourIn, cuartoReservado)
      }
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
  async presentAlert2(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      mode: 'ios',
      buttons: [{text: 'Ok', handler: ()=>{this.closeModal()}}]
    });

    await alert.present();
  }

  async presentAlert(header, subHeader, message, dui:string, tel:string, dir:string, fechaIn:string,
     hourIn:string, servicioReservado:string) {
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
            let cant:number = parseInt(JSON.stringify(this.valor['cantidad']))
            if(cant > 0 && this.canti < cant ){
              //let total:number = cant * parseInt(JSON.stringify(this.valor['precioU']))
              this.total = this.canti * parseInt(JSON.stringify(this.valor['precioU']))
              let reservarDetalle = this.afDB.object(`/registroVisitas/${this.datosPersonales['nombre']}/reservado/${this.valor['titulo']}`)
              .update({
                dui, tel, dir, cantidad: this.canti, fechaIn, hourIn, reservado: servicioReservado, total: this.total,  
                fechaPeticion: this.getDate(), horaPeticion: this.getTime(), nombre: this.datosPersonales['nombre']
              })
              let restarServicio = this.afDB.object(`/servicios/${this.valor['titulo']}`).update({
                cantidad: cant - this.canti
              })
              if(reservarDetalle && restarServicio){
                this.presentAlert2('¡Reservacion Realizada!', '', `Se ha reservado: ${this.canti} ${this.valor['titulo']}\nA nombre de: ${this.datosPersonales['nombre']}.
                \nIniciando: ${this.datosPersonales['fechIn']} a las ${this.datosPersonales['hourIn']}\nDurante 1 dia\n
                Con un precio Total de: $${this.total}\nRECUERDE AL LLEGAR AL HOTEL DAR SU NOMBRE PARA VERIFICAR SU RESERVACION`)
                this.showMsm(`${this.datosPersonales['nombre']}, tu reservacion se ha realizado`, 4000, 'success')
              }
              else{
                this.presentAlert2('Error', '', 'Error al Enviar los Datos\nCompruebe la conexion a Internet')
              }
            }
            else{
              this.showMsm('¡No hay más existencias!', 3000, 'danger')
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
  async showMsm(message, duration, color) {
    let toast = await this.toastController.create({
      message,
      duration,
      color,
      mode: 'ios',
    });
    toast.present();
  }

  getCantidad(cantidad:string):string{
    this.cantidad = cantidad
    return this.cantidad
  }

}
