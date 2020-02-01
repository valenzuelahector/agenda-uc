import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmar-anular-reserva',
  templateUrl: './confirmar-anular-reserva.component.html',
  styleUrls: ['./confirmar-anular-reserva.component.scss']
})
export class ConfirmarAnularReservaComponent implements OnInit {
  
  @Output() public dialogEvent:EventEmitter<any> = new EventEmitter();
  public cita:any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmarAnularReservaComponent>,
    @Inject(MAT_DIALOG_DATA) public citaData: {data:any},

  ) { 
    this.cita = citaData;
  }

  ngOnInit() {
  }

  actionAnular(action){
    this.dialogEvent.emit(action);
    this.dialogRef.close();
  }

}
