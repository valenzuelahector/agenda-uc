import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { MessageComponent } from 'src/app/shared/components/modals/message/message.component';
import { ConfirmarAnularReservaComponent } from '../shared/components/modals/confirmar-anular-reserva/confirmar-anular-reserva.component';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import 'moment-timezone';
import 'moment/locale/es';
import { AgendaAmbulatoriaService } from './agenda-ambulatoria.service';
import { PerfilProfesionalComponent } from '../shared/components/modals/perfil-profesional/perfil-profesional.component';
import { COLORES_CENTROS } from 'src/environments/centros-colores';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public progressBar: boolean = false;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  public verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public nuevaHora: EventEmitter<any> = new EventEmitter();
  public resetInfoPaciente: EventEmitter<any> = new EventEmitter();
  public emitClearBusquedaAnular = new Subject<any>();
  public reloadBusqueda: any = new Subject();
  public reloadBusquedaAnular: any = new Subject();
  public emitReservar: any = new Subject();
  public emitProfesionalRelacionado: any = new Subject();
  public emitBuscarProfesionalRelacionado: any = new Subject();
  public resetReserva : any = new Subject();
  public runReserva: any =  new Subject();

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public agendaService: AgendaAmbulatoriaService,
  ) {
  }

  showProgressBar() {
    this.progressBar = true;
  }

  hideProgressBar() {
    this.progressBar = false;
  }

  mDialog(title: string, message: string, type: string) {
    this.dialog.closeAll();
    let dialogConfirm = this.dialog.open(MessageComponent, {
      minWidth: '420px',
      maxWidth: '720px',
      data: { title: title, message: message, type: type },
      autoFocus: false,
      disableClose:true
    });
    return dialogConfirm.afterClosed();
  }

  aleatorio(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
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
      const tmp = run.split('-');
      let digv = tmp[1];
      const rut = tmp[0];
      if (digv == 'K') digv = 'k';
      return (this.checkRunDv(rut) == (digv as string).toUpperCase());
    }

  }

  checkRunDv(T) {
    let M = 0, S = 1;
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
  /*
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.id === f2.id;
  }*/

  compareFn(f1: any, f2: any): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
}

  reiniciarReserva() {
    this.nuevaHora.emit(true);
  }

  getReiniciarReserva() : Observable <any> {
    return this.nuevaHora.asObservable();
  }

  resetPaciente() {
    this.resetInfoPaciente.emit(true);
  }

  clearReserva(){
    this.resetReserva.next(true)
  }

  obsClearReserva() : Observable <any>{
    return this.resetReserva.asObservable();
  }

  validateEmail(correo) {
    let regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(correo) ? true : false;
  }

  replaceAll(str, find, replace) {
    return str.split(find).join(replace)
  }

  formatRut(rut) {
    rut = rut.toUpperCase();
    let rutPuntos;
    let actual = rut.replace(/^0+/, "");
    if (actual != '' && actual.length > 1) {
      let sinPuntos = actual.replace(/\./g, "");
      let actualLimpio = sinPuntos.replace(/-/g, "");
      let inicio = actualLimpio.substring(0, actualLimpio.length - 1);
      rutPuntos = "";
      let i = 0;
      let j = 1;
      for (i = inicio.length - 1; i >= 0; i--) {
        let letra = inicio.charAt(i);
        rutPuntos = letra + rutPuntos;
        if (j % 3 == 0 && j <= inicio.length - 1) {
          rutPuntos = "." + rutPuntos;
        }
        j++;
      }
      let dv = actualLimpio.substring(actualLimpio.length - 1);
      rutPuntos = rutPuntos + "-" + dv;
    }

    return rutPuntos;

  }

  getEmitClearBusquedaAnular(): Observable<any> {
    return this.emitClearBusquedaAnular.asObservable();
  }

  setEmitClearBusquedaAnular() {
    this.emitClearBusquedaAnular.next(true)
  }

  getEmitReservar(): Observable<any> {
    return this.emitReservar.asObservable();
  }

  setEmitReservar() {
    this.emitReservar.next(true)
  }

  getDataProfesionalRelacionado(): Observable<any> {
    return this.emitProfesionalRelacionado.asObservable();
  }

  setDataProfesionalRelacionado(data) {
    this.emitProfesionalRelacionado.next(data);
  }

  getBuscarProfesionalRelacionado(): Observable<any> {
    return this.emitBuscarProfesionalRelacionado.asObservable();
  }

  setBuscarProfesionalRelacionado(data) {
    this.emitBuscarProfesionalRelacionado.next(data);
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

  setReloadBusqueda() {
    this.reloadBusqueda.next(true)
  }

  getReloadBusqueda(): Observable<any> {
    return this.reloadBusqueda.asObservable();
  }

  setReloadBusquedaAnular() {
    this.reloadBusquedaAnular.next(true)
  }

  getReloadBusquedaAnular(): Observable<any> {
    return this.reloadBusquedaAnular.asObservable();
  }

  toLocalScl(date, utc = -180, format = null) {
    let dt = moment(date).utcOffset(utc).format(format);
    return dt;
  }

  toStringDateJson(dateString) {
    let d = dateString.split("T")[0].split("-");
    return {
      year: d[0],
      month: d[1],
      day: d[2]
    }
  }

  matchRecursoTrue(recurso) {

    let textRecurso = "";
    recurso.forEach((val, key) => {
      if (val['RecursoPrincipal']) {
        textRecurso = val['Recurso']['Nombre'];
      }
    })

    return textRecurso;
  }

  verPerfilProfesional(re) {
    this.agendaService.getDatosProfesional(re.id).subscribe(data => {
      if (data && data['statusCod'] && data['statusCod'] == 'OK') {
        let dialogRef = this.dialog.open(PerfilProfesionalComponent, {
          width: '840px',
          data: { profesionalData: data['datosProfesional'] }
        });
      } else {
        this.mDialog("Error", "No se puede mostrar el perfil. Intente más tarde", "error");
      }
    })
  }

  getColorCentro(idCentro){
    let color = '#802E87';
    COLORES_CENTROS.forEach((val, key) => {
      if(val['centro'] === idCentro){
        color = val['color'];
      }
    });
    return color;
  }

  async prepareFile(file: any, withPdf = true) {

    const datasUpload = [];
    let reader = new FileReader();
    let size = Math.round((file['size'] / 1000) * 100) / 100;

    return new Promise((resolve, reject) => {

      if (size <= 5000) {

        reader.readAsDataURL(file);
        reader.onload = () => {

          let file64 = String(reader.result).split(";");
          let namesplit = file['name'].split(".");

          let data = {
            name: file['name'],
            size: size + "KB",
            displayName: `${namesplit[0].substring(0, 16)}....${namesplit[1]}`,
            mimetype: file64[0].split(":")[1],
            file64: file64[1].split(",")[1],
            file: String(reader.result)
          }

          if ((withPdf && this.validarMimetype(data.mimetype)) || (!withPdf && this.validarMimeTypeRadiologia(data.mimetype)) ) {
            datasUpload.push(data);
            resolve(datasUpload);
          } else {
            reject(false);
            const extratxt = withPdf ? 'PNG, jPG o PDF.' : 'PNG o JPG.';
            this.mDialog("Atención", "Por favor, adjunte la orden médica en formato " + extratxt, "message");
          }

        };

      } else {
        this.mDialog("Atención", "El tamaño máximo permitido del archivo es 5MB.", "message");
      }

    });

  }

  validarMimetype(mimeType) {

    let isValid = false;

    switch (mimeType) {
      case 'image/png': isValid = true; break;
      case 'image/jpeg': isValid = true; break;
      case 'application/pdf': isValid = true; break;
    }

    return isValid;
  }

  validarMimeTypeRadiologia(mimeType){

    let isValid = false;

    switch (mimeType) {
      case 'image/png': isValid = true; break;
      case 'image/jpeg': isValid = true; break;
    }

    return isValid;

  }
}
