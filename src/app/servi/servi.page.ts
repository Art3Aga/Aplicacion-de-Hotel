import { ModalvisitasPage } from './../modalvisitas/modalvisitas.page';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ReservicioPage } from '../reservicio/reservicio.page';

@Component({
  selector: 'app-servi',
  templateUrl: './servi.page.html',
  styleUrls: ['./servi.page.scss'],
})
export class ServiPage implements OnInit {
  servicios:any[] = []
  services:Observable<any[]>
  constructor(public actionSheetController: ActionSheetController,
    public afDB: AngularFireDatabase, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.services = this.afDB.list(`servicios`).valueChanges()
    this.servicios = 
    [
      {
        titulo: 'Hamacas',
        img: '../../assets/avatars/hamaca.jpg'
      },
      {
        titulo: 'Sillas',
        img: '../../assets/avatars/sillas.jpg'
      },
      {
        titulo: 'Mesas',
        img: '../../assets/avatars/mesas.jpg'
      }
    ]
  }

  async presentActionSheet(object:any) {
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

  async reservarModal(object:any) {
    const modal = await this.modalCtrl.create({
      component: ReservicioPage,
      componentProps: {valor : object},
    });
  
    await modal.present();
  
  }
  async llenarForm() {
    const modal = await this.modalCtrl.create({
      component: ModalvisitasPage,
      //componentProps: {valor : object},
    });
  
    await modal.present();
  
  }

}
