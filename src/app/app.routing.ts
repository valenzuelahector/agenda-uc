import { RouterModule, Routes } from '@angular/router';
import { ReservacionComponent } from './pages/reservacion/reservacion.component';
import { AnularReservaComponent } from './pages/anular-reserva/anular-reserva.component';


const app_routes: Routes = [
  { path: '', component: ReservacionComponent },
  { path: 'anular-reserva', component: AnularReservaComponent },
  { path: ':area', component: ReservacionComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

export const APP_ROUTING = RouterModule.forRoot(app_routes, { useHash: false, scrollPositionRestoration: 'enabled'  });
