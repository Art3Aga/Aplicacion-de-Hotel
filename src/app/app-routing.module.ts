import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'registro', loadChildren: './registro/registro.module#RegistroPageModule' },
  { path: 'cuartos', loadChildren: './cuartos/cuartos.module#CuartosPageModule' },
  { path: 'reservar', loadChildren: './reservar/reservar.module#ReservarPageModule' },
  { path: 'categorias/:id', loadChildren: './categorias/categorias.module#CategoriasPageModule' },
  { path: 'servi', loadChildren: './servi/servi.module#ServiPageModule' },
  { path: 'reservicio', loadChildren: './reservicio/reservicio.module#ReservicioPageModule' },
  { path: 'modalvisitas', loadChildren: './modalvisitas/modalvisitas.module#ModalvisitasPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
