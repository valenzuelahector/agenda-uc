import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-perfil-profesional',
  templateUrl: './perfil-profesional.component.html',
  styleUrls: ['./perfil-profesional.component.scss']
})
export class PerfilProfesionalComponent implements OnInit {

  public profesionalData:any;

  @Output() public dialogEvent:EventEmitter<any> = new EventEmitter();


  constructor(@Inject(MAT_DIALOG_DATA) public data: {profesionalData:any}){

    this.profesionalData = data.profesionalData;

  }

  ngOnInit() {
  }

}
