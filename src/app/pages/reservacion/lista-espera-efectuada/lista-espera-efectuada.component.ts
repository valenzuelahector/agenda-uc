import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-lista-espera-efectuada',
  templateUrl: './lista-espera-efectuada.component.html',
  styleUrls: ['./lista-espera-efectuada.component.scss', './../confirmacion/confirmacion.component.scss']
})
export class ListaEsperaEfectuadaComponent implements OnInit, OnChanges {

  @Input() confirmacionListaEsperaData;
  @Input() busquedaInicial:any;

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(){
  }

  get getNotTelemedicina(){
    return this.utils.slugify(this.busquedaInicial.area.nombre, '-') !== 'telemedicina' && 
    this.utils.slugify(this.busquedaInicial.area.nombre, '-') !== 'consulta-medica-virtual'
  }
}
