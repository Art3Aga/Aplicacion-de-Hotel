import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  posicion:string = ""
  constructor(public platform: Platform){
    this.changePosicion()
  }
  changePosicion(){
    if(this.platform.is('android')){
      this.posicion = "bottom"
    }
    else{
      this.posicion = "top"
    }
  }

}
