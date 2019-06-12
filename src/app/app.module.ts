import { ModalvisitasPageModule } from './modalvisitas/modalvisitas.module';
import { ModalvisitasPage } from './modalvisitas/modalvisitas.page';
import { RegistroPageModule } from './registro/registro.module';
import { RegistroPage } from './registro/registro.page';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//firebase
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { CuartosPageModule } from './cuartos/cuartos.module';
import { CuartosPage } from './cuartos/cuartos.page';
import { ReservarPage } from './reservar/reservar.page';
import { ReservarPageModule } from './reservar/reservar.module';
import { MPipe } from './m.pipe';
import { FiltroPipe } from './filtro.pipe';
import { PipesModule } from "./pipes/pipes/pipes.module";
import { ReservicioPage } from './reservicio/reservicio.page';
import { ReservicioPageModule } from './reservicio/reservicio.module';
//import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [AppComponent, MPipe, FiltroPipe],
  entryComponents: [CuartosPage, ReservarPage, ReservicioPage, ModalvisitasPage],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    //AngularFireAuthModule,
    CuartosPageModule,
    ReservarPageModule,
    ReservicioPageModule,
    ModalvisitasPageModule,
    PipesModule

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
