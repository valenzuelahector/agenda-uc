import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.scss']
})
export class DetalleCitaComponent implements OnInit {
  
  @Input() public dataAnularCita:any = {};
  @Output() public emitAnular:EventEmitter<any> = new EventEmitter();

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit() {
  }

  anular(){
    this.emitAnular.emit(this.dataAnularCita['detalleCitaSeleccionada']);
  }
  

}
