import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reservacion-efectuada',
  templateUrl: './reservacion-efectuada.component.html',
  styleUrls: ['./reservacion-efectuada.component.scss']
})
export class ReservacionEfectuadaComponent implements OnInit {

  @Input() paciente:any;
  @Input() calendario:any;
  @Input() busquedaInicial:any;
  @Input() codCita:any;
  @Input() valorConvenio:any;
  @Input() mensajes:any = [];

  constructor() { }

  ngOnInit() {
  }

}
