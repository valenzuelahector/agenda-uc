import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-error-reserva',
  templateUrl: './error-reserva.component.html',
  styleUrls: ['./error-reserva.component.scss']
})
export class ErrorReservaComponent implements OnInit {

  @Output() public dialogEvent:EventEmitter<any> = new EventEmitter();

  public message: string;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: { message: string },
      public dialogRef: MatDialogRef<ErrorReservaComponent>,
    ) {
    this.message = data.message;
  }

  ngOnInit() {
  }

  volverBusqueda(){
    this.dialogEvent.emit(true);
    this.dialogRef.close();
  }
}
