import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-confirmacion-anulacion-reserva',
  templateUrl: './confirmacion-anulacion-reserva.component.html',
  styleUrls: ['./confirmacion-anulacion-reserva.component.scss']
})
export class ConfirmacionAnulacionReservaComponent implements OnInit, OnChanges {

  @Input() public respuestaAnular:any;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(){
    console.log(this.respuestaAnular);

  }

}
