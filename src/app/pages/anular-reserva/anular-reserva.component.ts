import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-anular-reserva',
  templateUrl: './anular-reserva.component.html',
  styleUrls: ['./anular-reserva.component.scss']
})
export class AnularReservaComponent implements OnInit {

  @ViewChild('tabGroup', { static: true }) tabGroup:any;
  
  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit() {
  }

}
