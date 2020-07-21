import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { SeleccionComponent } from './seleccion/seleccion.component';
import { IdentificacionComponent } from './identificacion/identificacion.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';
import { UtilsService } from 'src/app/services/utils.service';
import { ENV, dummyData } from 'src/environments/environment';
import gtag, { install } from 'ga-gtag';
import { ActivatedRoute } from '@angular/router';
import { IfStmt } from '@angular/compiler';

install('UA-143119471-2');

@Component({
  selector: 'app-reservacion',
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.scss']
})
export class ReservacionComponent implements OnInit, AfterViewInit, OnDestroy {

  public curEtapa: number = 0;
  public busquedaInfo: any;
  public paciente: any;
  public calendario: any;
  public reservaRealizada: boolean = false;
  public readQuery: boolean = false;
  public reglasActuales: any = [];
  public mensajesActuales: any = [];
  public codCita: number;
  public valorConvenio: number;
  public emitterReloadBusqueda:any;
  public reloadNumber = 0;
  public conoceTuMedico = false;
  public checkConoceTuMedico = false;
  public verMedicoAsociado = false;
  public datosBeneficiarioMedico;
  public rutMatch;
  public listaEsperaData;
  public confirmacionListaEsperaData;

  @ViewChild('tabGroup', { static: false }) tabGroup: any;
  @ViewChild('seleccion', { static: false }) seleccion: SeleccionComponent;
  @ViewChild('identificacion', { static: false }) identificacion: IdentificacionComponent;
  @ViewChild('confirmacion', { static: false }) confirmacion: ConfirmacionComponent;

  constructor(
    public utils: UtilsService,
    public aRouter: ActivatedRoute,
  ) {

  }

  ngAfterViewInit(){

    this.cambiarEtapa(0);

    this.seleccion.calendario.subscribe(data => {
      this.cambiarEtapa(2);
      this.calendario = data;
      this.listaEsperaData = null;
    })

    this.identificacion.datosPaciente.subscribe(data => {
      
      this.mensajesActuales = data.mensajes;
      this.paciente = data.paciente;
      this.valorConvenio = data.valorConvenio;
      this.calendario.cupo['idTipoCita'] = data['tipoCita'];
      this.calendario.cupo.centro['direccion'] = data['direccionCentro'];
      this.calendario.cupo['valorConvenio'] = data.valorConvenio;

      if (data.reglas && data.reglas.length > 0) {
        this.reglasActuales = { reglas: data.reglas, reservable: data.reservable };
        this.cambiarEtapa(3);
      } else {
        this.cambiarEtapa(4);
      }

    })

    this.identificacion.confirmacionListaEspera.subscribe( data => {
      this.confirmacionListaEsperaData = data;
      this.reservaRealizada = true;
      this.cambiarEtapa(4);
    });
    
  }

  confirmarReserva(data){
    if (data['response']) {
      this.reservaRealizada = true;
      this.listaEsperaData = null;
      this.codCita = data['data']['codCita'];
    }
  }

  busquedaEmitter(data){
    if (data && data.area && data.especialidad && data.centroAtencion) {
      this.busquedaInfo = data;
      this.cambiarEtapa(1);
    }

  }


  getParamsArea(){

    this.aRouter.params.subscribe( params => {
      if(params['area'] === 'conoce-tu-medico'){
        this.conoceTuMedico = true;
        setTimeout(()=> {
          this.readQuery = true;
        },2000)
      }
      this.checkConoceTuMedico = true;
    })
  
  }

  ngOnInit() {

    this.getParamsArea();
    this.emitterReloadBusqueda = this.utils.getReloadBusqueda().subscribe( r => {
      this.cambiarEtapa(1);
      this.reloadNumber = this.utils.aleatorio(1,99999);
    });

  }

  ngOnDestroy(){
    this.emitterReloadBusqueda.unsubscribe();
  }

  cambiarEtapa(index: number) {
    this.curEtapa = index;
    this.tabGroup.selectedIndex = this.curEtapa;

    if(index < 2){
      this.listaEsperaData = null;
    }

    window.scrollTo(0, 0);

  }

  nuevaReserva() {

    this.utils.reiniciarReserva();
    this.utils.resetPaciente();
    this.busquedaInfo = null
    this.paciente = null;
    this.calendario = null
    this.reservaRealizada = null;
    this.listaEsperaData = null;
    this.confirmacionListaEsperaData = null;
    this.cambiarEtapa(0);

    if(this.conoceTuMedico){
        this.nuevaBusquedaCM()
    }

  }

  readQuerySetter(event) {
    this.readQuery = event;
  }

  accionValidacionReglas(tipo: string) {
    switch (tipo) {

      case 'NUEVO':
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

  reservar(){
    this.utils.setEmitReservar()
  }

  setDatosBeneficiario(data){

    this.datosBeneficiarioMedico = data;
    this.rutMatch = data.rut;
    this.verMedicoAsociado = true;
    this.readQuery = false;

    setTimeout(()=> {
      this.readQuery = true;
      this.utils.hideProgressBar();
    },2000);

  }

  nuevaBusquedaCM(){

    this.utils.showProgressBar();
    this.readQuery = false;
    this.verMedicoAsociado = false;
    this.datosBeneficiarioMedico = null;
    this.rutMatch = null;
    setTimeout(()=> {
      this.readQuery = true;
      this.utils.hideProgressBar();
    },1500);

  }

  listaEspera(data){
    console.log(data);
    this.listaEsperaData = data;
    this.cambiarEtapa(2);
  }
}
