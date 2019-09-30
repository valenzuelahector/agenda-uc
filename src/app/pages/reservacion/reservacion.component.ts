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
  public mensajesActuales:any = [];
  public codCita:number;
  public valorConvenio:number;

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
      
      this.mensajesActuales = data.mensajes;
      if(data.reglas && data.reglas.length > 0){
        this.reglasActuales = { reglas: data.reglas, reservable: data.reservable };
        console.log(this.reglasActuales)
        if(this.reglasActuales.reservable){
          this.paciente = data.paciente;
          this.valorConvenio = data.valorConvenio;
        }
        this.cambiarEtapa(3);
      }else{
        this.paciente = data.paciente;
        this.valorConvenio = data.valorConvenio;
        this.cambiarEtapa(4);
      }
    })

    this.confirmacion.confirmarReserva.subscribe( data => {
      if(data['response']){
        this.cambiarEtapa(5);
        this.reservaRealizada = true;
        this.codCita = data['data']['codCita']
      }
    })
  }

  cambiarEtapa(index:number){
    this.curEtapa = index;
    this.tabGroup.selectedIndex = this.curEtapa;
    window.scrollTo(0, 0);

  }

  nuevaReserva(){
    this.utils.reiniciarReserva();
    this.utils.resetPaciente();
    this.busquedaInfo = null
    this.paciente = null;
    this.calendario = null
    this.reservaRealizada = null;
    this.cambiarEtapa(0);
  }
  
  readQuerySetter(event){
    this.readQuery = event;
  }

  accionValidacionReglas(tipo:string){
    switch(tipo){

      case 'NUEVO' :
        this.nuevaReserva();
      break;

      case 'VOLVER':
        this.reglasActuales = [];
        this.cambiarEtapa(2)
      break;

      case 'CONTINUAR':
        this.reglasActuales = [];
        this.cambiarEtapa(4)
      break;
    }

  }
}