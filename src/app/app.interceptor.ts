import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from './services/utils.service';
import { MatDialog } from '@angular/material';
import { tap } from "rxjs/internal/operators";

@Injectable()
export class Interceptor implements HttpInterceptor {

  public reqClone:any;
  public clearProgBar:any;
  constructor(
    public utils: UtilsService,
    private dialogRef: MatDialog
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let show = false;
    if(
      !request.url.includes('/Servicios/Rel/Especialidades') && 
      !request.url.includes('/Profesionales?idArea') && 
      !request.url.includes('/Profesionales?codCanal') && 
      !request.url.includes('validarenrolamiento') && 
      !request.url.includes('Autenticar') &&
      !request.url.includes('fromProfRel=true') && !request.url.includes('/CuposInmediatos') && 
      !request.url.includes('Areas') && !request.url.includes('Paises') &&  !request.url.includes('/Especialidades') &&
      !request.url.includes('/validarenrolamiento') &&
      !request.url.includes('/Perfil?rutProfesional') &&
      !request.url.includes('/Servicios?codCanal') &&
      !request.url.includes('/Servicios?idArea') && 
      !request.url.includes('fromSelCentros=true')){
      setTimeout(() => {
       this.utils.showProgressBar();
        clearTimeout(this.clearProgBar)
      }, 200);
      show = true;
    }else{
      show = false;
    }

    request = request.clone(this.reqClone);


    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && show) {
         this.clearProgBar = setTimeout(() => {
          this.utils.hideProgressBar();
          }, 3000);
        }
      }, error => {
        this.dialogRef.closeAll();
        this.utils.mDialog("Error", "Se ha producido un error interno. Intente más tarde.", "message");
        setTimeout(() => {
          this.utils.hideProgressBar();
        }, 3000);

      })
    );

  }

}