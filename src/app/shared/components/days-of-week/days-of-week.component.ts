import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import * as clone from 'clone';

@Component({
  selector: 'app-days-of-week',
  templateUrl: './days-of-week.component.html',
  styleUrls: ['./days-of-week.component.scss']
})
export class DaysOfWeekComponent implements OnInit, OnChanges {

  public months:any = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  public datedisplay:string;
  public dateBefore:any;
  public dateNext:any;
  public displayNext:boolean = true;
  public displayPrev:boolean = true;
  
  @Input() contadorMeses = 1;
  @Input() dayWeekFixed:boolean = false;
  @Input() navigationDate;
  @Input() minDateIn:Date;
  @Input() maxDateIn:Date;
  @Input() typeDateWeek;
  @Output() navigate:EventEmitter<any> = new EventEmitter();
  @Input() disableNavigation = false;

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges) : void{
    if(changes.minDateIn){
      //this.minDateIn = new Date(this.utils.toLocalScl(this.minDateIn, -180, 'YYYY-MM-DDTHH:mm:ss'))
      let  minDateIn = clone(this.minDateIn)  ;

      minDateIn.setDate(1);
      minDateIn.setHours(6);
      minDateIn.setMinutes(0);
      minDateIn.setSeconds(0);

      this.datedisplay = this.months[minDateIn.getMonth()] + " " + minDateIn.getFullYear();
      minDateIn.setMonth(minDateIn.getMonth() + 1);
      this.dateNext = this.months[minDateIn.getMonth()] + "<br/>" + minDateIn.getFullYear();
      minDateIn.setMonth(minDateIn.getMonth() -2);
      this.dateBefore = this.months[minDateIn.getMonth()] + "<br/>" + minDateIn.getFullYear();
    }
  }

  move(action){
    if((this.contadorMeses === 0 && action === 'prev') || (this.contadorMeses === 12  && action === 'next') || this.disableNavigation){
      return false;
    }
    if(action == 'next'){
      this.contadorMeses++
    }else{
      this.contadorMeses--
    }

    this.navigate.emit(action)
  }

}
