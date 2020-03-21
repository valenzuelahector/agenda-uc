import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-listado-citas',
  templateUrl: './listado-citas.component.html',
  styleUrls: ['./listado-citas.component.scss', './../anular-reserva.component.scss']
})
export class ListadoCitasComponent implements OnInit {

  @Input() public dataAnularCita:any;
  @Output() public emitVerDetalle:EventEmitter<any> = new EventEmitter();
  @Output() public emitAnular:EventEmitter<any> = new EventEmitter();
  
  public todayTime = (new Date()).getTime();

  constructor() { }

  ngOnInit() {
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
  
  verDetalle(data){
    this.emitVerDetalle.emit(data);
  }

  anular(data){
    this.emitAnular.emit(data);
  }
}
