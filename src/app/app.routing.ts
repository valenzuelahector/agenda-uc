import { RouterModule, Routes } from '@angular/router';
import { ReservacionComponent } from './pages/reservacion/reservacion.component';


const app_routes: Routes = [
  { path: '', component: ReservacionComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

export const APP_ROUTING = RouterModule.forRoot(app_routes, { useHash: false, scrollPositionRestoration: 'enabled'  });
