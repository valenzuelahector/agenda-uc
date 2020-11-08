import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.scss']
})
export class EncuestasComponent implements OnInit {

  @Output() public dialogEvent:EventEmitter<any> = new EventEmitter();
  @ViewChild('tabGroup', { static: false }) tabGroup: any;

  curPregunta = 1;
  init = false;
  preguntas = [
    { data: null},
    { data: null},
    { data: null},
    { data: null},
    { data: null},
    { data: null},
    { data: null},
    { data: null},
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public inp: { data: any },
    public dialogRef: MatDialogRef<EncuestasComponent>,
  ) { }

  ngOnInit() {
    setTimeout(()=> {
      this.init = true;
    },1500)
  }

  get distanceFromOrigin(){
    return ((100 / (this.preguntas.length - 1)) * (this.curPregunta - 1))
  }

  cambiarPregunta(index: number) {

    this.curPregunta = index;
    this.tabGroup.selectedIndex = index - 1;

  }
}
