import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { MessageComponent } from 'src/app/shared/components/modals/message/message.component';
import { ConfirmarAnularReservaComponent } from '../shared/components/modals/confirmar-anular-reserva/confirmar-anular-reserva.component';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import 'moment-timezone';
import 'moment/locale/es';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public progressBar: boolean = false;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  public verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public nuevaHora:EventEmitter<any> = new EventEmitter();
  public resetInfoPaciente:EventEmitter<any> = new EventEmitter();
  public emitClearBusquedaAnular = new Subject<any>();
  public reloadBusqueda:any = new Subject();
  public reloadBusquedaAnular:any = new Subject();

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { 
  }

  showProgressBar() {
    this.progressBar = true;
  }

  hideProgressBar() {
    this.progressBar = false;
  }

  mDialog(title: string, message: string, type: string) {
    let dialogConfirm = this.dialog.open(MessageComponent, {
      width: '400px',
      data: { title: title, message: message, type: type },
      autoFocus: false
    });
    return dialogConfirm.afterClosed();
  }

  message(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: "my-snackbar"
    });
  }

  validateRun(run) {

    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(run)) {
      return false
    } else {
      var tmp = run.split('-');
      var digv = tmp[1];
      var rut = tmp[0];
      if (digv == 'K') digv = 'k';
      return (this.checkRunDv(rut) == (digv as string).toUpperCase());
    }

  }

  checkRunDv(T) {
    var M = 0, S = 1;
    for (; T; T = Math.floor(T / 10))
      S = (S + T % 10 * (9 - M++ % 6)) % 11;
    return S ? S - 1 : 'K';
  }

  trDateStr(date: Date, type = 'string', compensacion = null) {

    let year = date.getFullYear();
    let month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
    let hour = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    let min = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    let sec = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
    
    if (type == 'json') {
      return { year: year, month: month, day: day, hour: hour, min: min, sec: sec }
    }

    let sign = null;
    let time = null;

    if (!compensacion) {
      sign = '-';
      time = '00:00'
    } else {
      let timeZone = compensacion / 60;
      sign = (timeZone < 0) ? '-' : '+';
      timeZone = (timeZone < 0) ? timeZone * -1 : timeZone;
      time = (timeZone > 9) ? timeZone + ':00' : '0' + timeZone + ':00';
    }


    return year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec + sign + time;
  }


  numberOnly(event, activate?: boolean): boolean {
    if (activate != undefined && !activate) {
      return;
    }

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
  }

  reiniciarReserva() {
    this.nuevaHora.emit(true);
  }

  resetPaciente() {
    this.resetInfoPaciente.emit(true);
  }

  validateEmail(correo) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(correo) ? true : false;
  }

  replaceAll(str, find, replace) {
    return str.split(find).join(replace)
  }

  formatRut(rut) {
    rut = rut.toUpperCase();
    let actual = rut.replace(/^0+/, "");
    if (actual != '' && actual.length > 1) {
      var sinPuntos = actual.replace(/\./g, "");
      var actualLimpio = sinPuntos.replace(/-/g, "");
      var inicio = actualLimpio.substring(0, actualLimpio.length - 1);
      var rutPuntos = "";
      var i = 0;
      var j = 1;
      for (i = inicio.length - 1; i >= 0; i--) {
        var letra = inicio.charAt(i);
        rutPuntos = letra + rutPuntos;
        if (j % 3 == 0 && j <= inicio.length - 1) {
          rutPuntos = "." + rutPuntos;
        }
        j++;
      }
      var dv = actualLimpio.substring(actualLimpio.length - 1);
      rutPuntos = rutPuntos + "-" + dv;
    }

    return rutPuntos;

  }

  getEmitClearBusquedaAnular() : Observable<any>{
    return this.emitClearBusquedaAnular.asObservable();
  }

  setEmitClearBusquedaAnular(){
    this.emitClearBusquedaAnular.next(true)
  }
  
  slugify(str, separator) {

    str = str.trim();
    str = str.toLowerCase();

    const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaaaeeeeiiiioooouuuunc------";

    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    return str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-") // collapse dashes
      .replace(/^-+/, "") // trim - from start of text
      .replace(/-+$/, "") // trim - from end of text
      .replace(/-/g, separator);
  }

  setReloadBusqueda(){
    this.reloadBusqueda.next(true)
  }

  getReloadBusqueda(): Observable<any> {
    return this.reloadBusqueda.asObservable();
  }
  
  setReloadBusquedaAnular(){
    this.reloadBusquedaAnular.next(true)
  }

  getReloadBusquedaAnular(): Observable<any> {
    return this.reloadBusquedaAnular.asObservable();
  }

  toLocalScl(date, utc = -180, format = null){
    let dt = moment(date).utcOffset(utc).format(format);
    return dt;
  }

  toStringDateJson(dateString){
    let d = dateString.split("T")[0].split("-");
    return {
      year: d[0],
      month: d[1],
      day: d[2]
    }
  }

  matchRecursoTrue(recurso){

    let textRecurso = "";
    recurso.forEach((val, key) =>{ 
      if(val['RecursoPrincipal']){
        textRecurso = val['Recurso']['Nombre'];
      }
    })

    return textRecurso;
  }
}
