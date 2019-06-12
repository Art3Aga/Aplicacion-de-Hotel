import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  user:any = {}
  username:string
  constructor(private afDB: AngularFireDatabase, public platform: Platform) { }



  verificarUser2(name:string, clave:string){
    clave = clave.toLocaleLowerCase();
    return new Promise((resolve, reject)=>{
      this.afDB.object(`registro/${name}-${clave}/Favoritos`).valueChanges().subscribe(
        (usuario)=>{
          if(usuario){
            this.user = usuario
            console.log(this.user);
            
            //console.log(JSON.stringify(usuario['nombre']));
            console.log(name);
            //localStorage.setItem('usuario', JSON.stringify(usuario['nombre']))
            localStorage.setItem('usuario', name)
            resolve(true);
          }
          else{
            resolve(false);
          }
        });
    });
  }
  verificarUser(name:string, clave:string){
    clave = clave.toLocaleLowerCase();
    return new Promise((resolve, reject)=>{
      this.afDB.object(`registro/${name}-${clave}/DatosPersonales`).valueChanges().subscribe(
        (usuario)=>{
          if(usuario){
            this.user = usuario
            console.log(usuario);
            localStorage.setItem('usuario', `${usuario['nombre']}-${usuario['password']}`)
            resolve(true);
          }
          else{
            resolve(false);
          }
        });
    });
  }

  verificarUser3(name:string, clave:string){
    clave = clave.toLocaleLowerCase();
    return new Promise((resolve, reject)=>{
      this.afDB.object(`registro/${name}-${clave}/Favoritos`).valueChanges().subscribe(
        (usuario)=>{
          if(usuario){
            this.user = usuario
            console.log(usuario);
            localStorage.setItem('usuario', JSON.stringify(usuario))
            resolve(true);
          }
          else{
            resolve(false);
          }
        });
    });
  }

  getUsername():string{
    this.username = localStorage.getItem('usuario')
    return this.username
  }
}
