import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-validacion',
  templateUrl: './error-validacion.component.html',
  styleUrls: ['./error-validacion.component.scss']
})
export class ErrorValidacionComponent implements OnInit {

  @Input() reglas:any = {};
  @Input() mensajes:any = [];
  @Output() emitAccionar:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  accionar(tipo:string){
    this.emitAccionar.emit(tipo)
  }
}
