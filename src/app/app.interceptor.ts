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
    
    if(request.url.indexOf('/Servicios/Rel/Especialidades') < 0 && request.url.indexOf('/Profesionales?idArea') < 0){
      setTimeout(() => {
        this.utils.showProgressBar();
        clearTimeout(this.clearProgBar)
      }, 200);
    }

    request = request.clone(this.reqClone);


    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
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
