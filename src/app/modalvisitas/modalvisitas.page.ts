import { ReservicioPage } from './../reservicio/reservicio.page';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modalvisitas',
  templateUrl: './modalvisitas.page.html',
  styleUrls: ['./modalvisitas.page.scss'],
})
export class ModalvisitasPage implements OnInit {
  servicio:Observable<any>
  usuario:string
  dui:string = ""
  tel:string = ""
  dir:string = ""
  fechIn:string = ""
  fechFin:string = ""
  hourIn:string = ""
  hourFin:string = ""
  cantidad:string = ""
  canti:number = 0
  estado:string = ""
  total:number = 0
  nombre:string = ""
  registrado:boolean = false
  today = new Date()
  services:Observable<any[]>
  constructor(public modalCtrl: ModalController,public afDB:AngularFireDatabase, 
    public alertController: AlertController, public toastController: ToastController,
    public actionSheetController: ActionSheetController) { 
      //localStorage.getItem('usuario') == null ? this.usuario = "usuario-usuario" : this.usuario = localStorage.getItem('usuario')
      if(localStorage.getItem('usuario') == null){
        this.usuario = "usuario-usuario"
        this.nombre = ""
      }
      else{
        this.usuario = localStorage.getItem('usuario')
        this.nombre = this.usuario.split('-')[0]
      }
    }

  ngOnInit() {
    this.getDate()
    this.services = this.afDB.list(`servicios`).valueChanges()
    //localStorage.getItem('usuario') == null ? this.usuarioStorage = "usuario-usuario" : this.usuarioStorage = localStorage.getItem('usuario')
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
  async presentActionSheet(object:any) {
    if(this.registrado != false){
      const actionSheet = await this.actionSheetController.create({
        header: 'Seleccione Opcion',
        mode: 'ios',
        translucent: true,      
        buttons: [{
          text: 'Reservar',
          icon: 'hand',
          handler: () => {
            this.reservarModal(object)
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'destructive',
          handler: () => {
            console.log('Share clicked');
          }
        }]
      });
      await actionSheet.present();
    }
    else{
      this.presentAlert3('Error', '', 'Primero debe registrarse antes de poder reservar un servicio\no puede reservarlo en el Hotel')
    }
  }

  async reservarModal(object:any) {
    let datosPersonales:any = {
      nombre: this.nombre,
      dui: this.dui,
      tel: this.tel,
      dir: this.dir,
      fechIn: this.fechIn,
      hourIn: this.hourIn
    }
    if(this.registrado != false){
      const modal = await this.modalCtrl.create({
        component: ReservicioPage,
        componentProps: {
          valor : object,
          datosPersonales: datosPersonales
        },
      });
    
      await modal.present();
    }
    else{
      this.presentAlert3('Error', '', 'Primero debe registrarse antes de poder reservar un servicio\no puede reservarlo en el Hotel')
    }
  }

  /*roomPedidoDetalle(dui:string, tel:string, dir:string, fechaIn:string,
    fechaFin:string, hourIn:string, hourFin:string, cuartoReservado:string){
      if(dui == null || tel == "" || dir == "" || fechaIn == ""|| fechaFin == "" || hourIn == "" || hourFin =="" || cuartoReservado == ""){
        this.presentAlert3('Falta de Datos', '', 'Debe Ingresar todos los datos requeridos')
      }
      else{
        this.presentAlert('¿Seguro?', '', '¿Desea Realizar esta Reservacion?', dui, tel, dir, fechaIn, 
        fechaFin, hourIn, hourFin, cuartoReservado)
      }
  }*/
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

  /*async presentAlert(header, subHeader, message, dui:string, tel:string, dir:string, fechaIn:string,
    fechaFin:string, hourIn:string, hourFin:string, servicioReservado:string) {
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
              let reservarDetalle = this.afDB.object(`/reservacionDetalle/${this.usuarioStorage}/${this.valor['titulo']}`)
              .update({
                dui, tel, dir, cantidad: this.canti, fechaIn, fechaFin, hourIn, hourFin, servicioReservado, total: this.total,  
                fechaPeticion: this.getDate(), horaPeticion: this.getTime(), nombre: this.usuarioStorage.split('-')[0]
              })
              let restarServicio = this.afDB.object(`/servicios/${this.valor['titulo']}`).update({
                cantidad: cant - this.canti
              })
              if(reservarDetalle && restarServicio){
                this.presentAlert2('¡Reservacion Realizada!', '', `Se ha reservado: ${this.canti} ${this.valor['titulo']}\nA nombre de: ${this.usuarioStorage.split('-')[0]}.
                \nIniciando: ${this.fechIn} a las ${this.hourIn}\ny Finalizando: ${this.fechFin} a las ${this.hourFin}\n
                Con un precio Total de: ${this.total}`)
                this.showMsm(`${this.usuarioStorage.split('-')[0]}, tu reservacion se ha realizado`, 4000, 'success')
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
  }*/
  async showMsm(message, duration, color) {
    let toast = await this.toastController.create({
      message,
      duration,
      color,
      mode: 'ios',
    });
    toast.present();
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
  registrarVisita(){

      if(this.dui == null || this.tel == "" || this.dir == "" || this.fechIn == "" || this.hourIn == "" || this.nombre == ""){
        this.presentAlert3('Falta de Datos', '', 'Debe Ingresar todos los datos requeridos')
      }
      else{
        let registro = this.afDB.object(`registroVisitas/${this.nombre}`).update({
          nombre: this.nombre,
          dui: this.dui,
          tel: this.tel,
          dir: this.dir,
          fechaIn: this.fechIn,
          hourIn: this.hourIn
        })
        if(registro){
          this.presentAlert3('¡Registrado Correctamente!', '' , `${this.nombre.split(' ')[0]}, Se ha reservado su estadia
          en Hotel Torola Bay View empezando el : ${this.fechIn} a las ${this.hourIn}, estadia de 1 dia\n
          Tambien puede reservar alguno de nuestros servicios que se presentan acontinuacion
          \nRECUERDE AL LLEGAR AL HOTEL DAR SU NOMBRE PARA VERIFICAR SU RESERVACION`)
          this.showMsm(`${this.nombre.split('-')[0]}\nSe ha realizado su estadia de 1 dia`, 4000, 'success')
          this.registrado = true
        }
      }
    }

}
