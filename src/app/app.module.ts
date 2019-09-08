import { BrowserModule } from '@angular/platform-browser';
import { APP_ROUTING } from './app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Interceptor } from './app.interceptor';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/es';
registerLocaleData(locale, 'es');
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ReservacionComponent } from './pages/reservacion/reservacion.component';
import { BusquedaComponent } from './pages/reservacion/busqueda/busqueda.component';
import { SeleccionComponent } from './pages/reservacion/seleccion/seleccion.component';
import { IdentificacionComponent } from './pages/reservacion/identificacion/identificacion.component';
import { ConfirmacionComponent } from './pages/reservacion/confirmacion/confirmacion.component';
import { AngularMaterialModule } from './app.material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageComponent } from './shared/components/modals/message/message.component';
import { PerfilProfesionalComponent } from './shared/components/modals/perfil-profesional/perfil-profesional.component';
import { ErrorValidacionComponent } from './pages/reservacion/error-validacion/error-validacion.component';
import { ReservacionEfectuadaComponent } from './pages/reservacion/reservacion-efectuada/reservacion-efectuada.component';
import { RutFormaterDirective } from './shared/directives/rut-formater.directive';
import { OrderModule } from 'ngx-order-pipe';
import { MyDateAdapter } from './dateAdapter';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ReservacionComponent,
    BusquedaComponent,
    SeleccionComponent,
    IdentificacionComponent,
    ConfirmacionComponent,
    MessageComponent,
    PerfilProfesionalComponent,
    ErrorValidacionComponent,
    ReservacionEfectuadaComponent,
    RutFormaterDirective
  ],
  imports: [
    BrowserModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    OrderModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: DateAdapter, useClass: MyDateAdapter },
  ],
  bootstrap: [AppComponent],
  entryComponents:[
      MessageComponent,
      PerfilProfesionalComponent
  ]
})
export class AppModule { }
