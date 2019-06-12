import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { UsuarioService } from '../servicios/usuario.service';
import { LoadingController } from '@ionic/angular';

//import { AngularFireAuth } from '@angular/fire/auth';
//import  * as firebase from 'firebase/app';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  usuarios:Observable<any[]>
  nombre:string = ""
  username:string = ""
  password:string = ""
  btnSocials:any[] = []
  //edad:number = 18
  //lugar:string = ""
  habilitar:boolean = false
  constructor(public afDB: AngularFireDatabase, public toastController: ToastController,
    public navCtrl: NavController, private usuarioService:UsuarioService,
     public loadingController: LoadingController, public alertController: AlertController /*private afAuth: AngularFireAuth*/){
    this.usuarios = afDB.list('registro').valueChanges()
    this.btnSocials = [
      {
        icon: 'logo-facebook',
        color: 'primary'
      },
      {
        icon: 'logo-googleplus',
        color: 'danger'
      },
      {
        icon: 'logo-twitter',
        color: 'secondary'
      }
    ]
  }

  //signInWithFacebook() {
    //this.afAuth.auth
      //.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      //.then(res => {
       // console.log(res)
      //});
  //}

  ngOnInit() {
    if(this.nombre.length == 0 || this.password.length == 0){
      this.habilitar = true
      console.log(this.habilitar)
      
    }
    else if(this.nombre.length > 0 || this.password.length > 0){
      this.habilitar = false
      console.log(this.habilitar)
      
    }
  }

  saveUser(){
    let user:any = {
      nombre: this.nombre,
      password: this.password,
    }
    try {
      //this.afDB.object(`/registro/${this.nombre}/DatosPersonales`).update(user)
      if(this.afDB.object(`/registro/${this.nombre}-${this.password}/DatosPersonales`).update(user)){
        this.showMsm('¡Bienvenido! \n' + this.nombre ,3000, 'success')
        this.verificarUsuario(this.nombre, this.password)
        this.nombre = ""
        this.password = ""
        this.navCtrl.navigateBack('/')
      }
    } catch (error) {
      console.log(error)
      
    }

  }
  refresh(){
    window.location.reload();
  }
  async showMsm(message, duration, color) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      mode: 'ios', 
      position: 'top',
    });
    toast.present();
  }
  async verificarUsuario(name:string, clave:string) {
    this.usuarioService.verificarUser(name, clave).then((existe)=>{
      if(existe){
        this.showMsm(`Bienvenido ${name}`, 2000, 'success')
        this.username = localStorage.getItem('usuario').split('-')[0]
        this.navCtrl.navigateBack('/')
        window.location.reload();
      }
      else{
        this.presentAlert('Usuario Incorrecto', '', 'Intente de Nuevo o Regístrese')
      }
    })
    /*const loading = await this.loadingController.create({
      spinner: 'lines',
      duration: 200,
      message: 'Verificando...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();*/
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

}
