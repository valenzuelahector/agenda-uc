import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { MessageComponent } from 'src/app/shared/components/modals/message/message.component';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public progressBar: boolean = false;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  public verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public nuevaHora:EventEmitter<any> = new EventEmitter();
  public resetInfoPaciente:EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

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

  trDateStr(date: Date, type = 'string'){

    let year = date.getFullYear();
    let month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1 ;
    let day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
    let hour = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    let min = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    let sec = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
    if(type == 'json'){
      return { year: year, month: month,  day : day, hour: hour, min : min, sec : sec }
    }
    return  year + "-" + month + "-" + day + "T" + hour + ":" + min +":" + sec + "-04:00";
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

  reiniciarReserva(){
    this.nuevaHora.emit(true);
  }

  resetPaciente(){
    this.resetInfoPaciente.emit(true);
  }

  validateEmail(correo) {
    let re = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if (!re.test(correo)) {
      return false;
    } else {
      return true;
    }
  }

  replaceAll(str, find, replace) {
    return str.split(find).join(replace)
  }
}
