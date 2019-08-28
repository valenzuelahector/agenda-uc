import { Component, OnInit, ViewChild } from '@angular/core';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { SeleccionComponent } from './seleccion/seleccion.component';
import { IdentificacionComponent } from './identificacion/identificacion.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reservacion',
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.scss']
})
export class ReservacionComponent implements OnInit {

  public curEtapa:number = 0;
  public busquedaInfo:any;
  public paciente:any;
  public calendario:any;
  public reservaRealizada:boolean = false;
  public readQuery:boolean = false;
  public reglasActuales:any = [];

  @ViewChild('tabGroup') tabGroup:any;
  @ViewChild('busqueda') busqueda:BusquedaComponent;
  @ViewChild('seleccion') seleccion:SeleccionComponent;
  @ViewChild('identificacion') identificacion:IdentificacionComponent;
  @ViewChild('confirmacion') confirmacion:ConfirmacionComponent;

  constructor(
    public utils:UtilsService
  ) {

  }

  ngOnInit() {
    this.cambiarEtapa(0);

    this.busqueda.emitBusqueda.subscribe( data => {
      if(data && data.area && data.especialidad && data.centroAtencion){
        this.busquedaInfo = data;
        this.cambiarEtapa(1);
      }
    })

    this.seleccion.calendario.subscribe( data => {
      this.cambiarEtapa(2);
      this.calendario = data;
    })

    this.identificacion.datosPaciente.subscribe( data => {
      if(data.reglas && data.reglas.length > 0){
        this.reglasActuales =  data.reglas;
        this.cambiarEtapa(5);
      }else{
        this.cambiarEtapa(3);
        this.paciente = data.paciente;
      }

    })

    this.confirmacion.confirmarReserva.subscribe( data => {
      if(data['response']){
        this.reservaRealizada = true;
      }
    })
  }

  cambiarEtapa(index:number){
    this.curEtapa = index;
    this.tabGroup.selectedIndex = this.curEtapa;
  }

  nuevaReserva(){
    this.utils.reiniciarReserva();
    this.busquedaInfo = null
    this.paciente = null;
    this.calendario = null
    this.reservaRealizada = null;
    this.cambiarEtapa(0);
  }
  
  readQuerySetter(event){
    this.readQuery = event;
  }
}
