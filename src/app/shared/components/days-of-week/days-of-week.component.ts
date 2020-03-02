import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-days-of-week',
  templateUrl: './days-of-week.component.html',
  styleUrls: ['./days-of-week.component.scss']
})
export class DaysOfWeekComponent implements OnInit, OnChanges {

  public months:any = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  public datedisplay:string;
  public dateBefore:string;
  public dateNext:string;
  public displayNext:boolean = true;
  public displayPrev:boolean = true;
  public contadorMeses = 1;

  @Input() dayWeekFixed:boolean = false;
  @Input() navigationDate;
  @Input() minDateIn:Date;
  @Input() maxDateIn:Date;
  @Output() navigate:EventEmitter<any> = new EventEmitter();

  constructor() { }
/**/ 
  ngOnInit() {
  }

  

  ngOnChanges(changes:SimpleChanges) : void{

    if(this.minDateIn){
      let idxMonth = this.minDateIn.getMonth();
      let year =  this.minDateIn.getFullYear();
      this.datedisplay = this.months[idxMonth] + " " + year;
    }
  }

  move(action){

    if(action == 'next'){
      this.contadorMeses++
    }else{
      this.contadorMeses--
    }

    this.navigate.emit(action)
  }

}
