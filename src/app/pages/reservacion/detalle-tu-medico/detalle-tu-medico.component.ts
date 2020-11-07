import { Component, OnInit, Input, OnChanges, Output, EventEmitter, HostListener } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-detalle-tu-medico',
  templateUrl: './detalle-tu-medico.component.html',
  styleUrls: ['./detalle-tu-medico.component.scss',
              '../seleccion/seleccion.component.scss'
  ]
})
export class DetalleTuMedicoComponent implements OnInit, OnChanges {

  @Input() dbm:any;
  @Output() medBuscaCalendario: EventEmitter<any> = new EventEmitter();
  @Output() nuevaBusqueda: EventEmitter<boolean> = new EventEmitter();
  isReponsive = false;

  dt:any;

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit() {
    this.onResize();
  }

  ngOnChanges(){
    this.dt = (this.dbm && this.dbm.data) ? this.dbm.data : {};
  }

  buscarCalendario(datosBusqueda){
    this.medBuscaCalendario.emit(datosBusqueda);
  }

  verPerfil(re){
      this.utils.verPerfilProfesional({id: re.idProfesional });
  }

  @HostListener('window:resize', [])
  onResize(): void {

    if (window.innerWidth <= 960) {
      this.isReponsive = true;
    } else {
      this.isReponsive = false;
    }
    
  }

  nuevaBusquedaE(){
    this.nuevaBusqueda.emit(true);
  }

}
