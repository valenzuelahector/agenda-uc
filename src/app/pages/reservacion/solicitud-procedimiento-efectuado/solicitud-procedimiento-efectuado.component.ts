import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-solicitud-procedimiento-efectuado',
  templateUrl: './solicitud-procedimiento-efectuado.component.html',
  styleUrls: ['./solicitud-procedimiento-efectuado.component.scss',  
              './../confirmacion/confirmacion.component.scss']
})
export class SolicitudProcedimientoEfectuadoComponent implements OnInit {

  @Input() confirmacionProcedimiento:any;
  @Input() busquedaInicial:any;

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit() {
  }

  get getNotTelemedicina(){
    return this.utils.slugify(this.busquedaInicial.area.nombre, '-') !== 'telemedicina' && 
    this.utils.slugify(this.busquedaInicial.area.nombre, '-') !== 'consulta-medica-virtual'
  }
}
