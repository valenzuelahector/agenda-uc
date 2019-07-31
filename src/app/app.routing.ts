import { RouterModule, Routes } from '@angular/router';
import { ReservacionComponent } from './pages/reservacion/reservacion.component';


const app_routes: Routes = [
  { path: 'reservacion', component: ReservacionComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'reservacion' }
];

export const APP_ROUTING = RouterModule.forRoot(app_routes, { useHash: true, scrollPositionRestoration: 'enabled'  });
