import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from './services/utils.service';
import { MatDialog } from '@angular/material';
import { tap, finalize, delay } from "rxjs/internal/operators";

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
      this.utils.showProgressBar();
    }

    request = request.clone(this.reqClone);

    return next.handle(request).pipe(
      tap(event => {

      }, error => {
        this.dialogRef.closeAll();
        this.utils.mDialog("Error", "Se ha producido un error interno. Intente más tarde.", "message");
        this.utils.hideProgressBar()
      }),
      delay(2000),
      finalize(() => this.utils.hideProgressBar())
    );

  }

}
