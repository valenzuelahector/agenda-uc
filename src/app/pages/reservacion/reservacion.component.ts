import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { SeleccionComponent } from './seleccion/seleccion.component';
import { IdentificacionComponent } from './identificacion/identificacion.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';
import { UtilsService } from 'src/app/services/utils.service';
import { ENV } from 'src/environments/environment';
import gtag, { install } from 'ga-gtag';
import { ActivatedRoute, Router } from '@angular/router';

install(ENV.analyticsCode);

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
  public emitterReloadBusqueda: any;
  public reloadNumber = 0;
  public saludIntegral = false;
  public checkSaludIntegral = false;
  public verMedicoAsociado = false;
  public datosBeneficiarioMedico;
  public rutMatch;
  public listaEsperaData;
  public confirmacionListaEsperaData;
  public confirmacionProcedimiento;
  public isProcedimiento = false;
  public buscarProfesionalRelacionadoSuscription;
  public resetReservaObj;
  public volverSaludIntegralSuscription;
  public removerDerivacion = false;
  public saludEspecialidad;
  public saludIntgralBotonVolver = {
    text: '',
    estado: ''
  };

  @ViewChild('tabGroup', { static: false }) tabGroup: any;
  @ViewChild('seleccion', { static: false }) seleccion: SeleccionComponent;
  @ViewChild('identificacion', { static: false }) identificacion: IdentificacionComponent;
  @ViewChild('confirmacion', { static: false }) confirmacion: ConfirmacionComponent;

  constructor(
    public utils: UtilsService,
    public aRouter: ActivatedRoute,
    public router: Router
  ) {

  }

  ngAfterViewInit() {

    this.cambiarEtapa(0);

    this.resetReservaObj = this.utils.obsClearReserva().subscribe(r => {
      this.resetReserva();
    });

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

      if (!this.busquedaInfo.documentoPaciente) {
        this.busquedaInfo.documentoPaciente = {
          tipoDocumento: data.busquedaPaciente.tipoDocumento,
          documento: data.busquedaPaciente.documento,
          documentoFormateado: data.busquedaPaciente.documentoFormateado
        }
      }

      if (data.reglas && data.reglas.length > 0) {
        this.reglasActuales = { reglas: data.reglas, reservable: data.reservable };
      }

      setTimeout(() => {
        this.utils.setEmitReservar();
      }, 500);


    });

    this.identificacion.confirmacionListaEspera.subscribe(data => {
      this.confirmacionListaEsperaData = data;
      this.reservaRealizada = true;
      this.cambiarEtapa(4);
    });

    this.identificacion.confirmacionProcedimiento.subscribe(data => {
      this.confirmacionProcedimiento = data;
      this.reservaRealizada = true;
      this.cambiarEtapa(4);
    });

    this.buscarProfesionalRelacionadoSuscription = this.utils.getBuscarProfesionalRelacionado().subscribe(data => {
      this.busquedaInfo = data;
      this.cambiarEtapa(1);
    });

    this.volverSaludIntegralSuscription = this.utils.saludIntegralVolver().getVolver().subscribe(res => {

      switch (res) {
        case 'VISTA_DERIVACION':
          this.saludIntgralBotonVolver.text = 'SALIR';
          break;
        case 'VISTA_CALENDARIO':
        case 'VISTA_AGENDA_PROFESIONAL':
          this.saludIntgralBotonVolver.text = 'VOLVER';
          break;
      }

      this.saludIntgralBotonVolver.estado = res;

    });

    this.saludEspecialidad = this.utils.especialidadDerivaciones().getEspecialidad().subscribe(data => {
      this.utils.showProgressBar()
      this.busquedaEmitter(data);
    });

  }

  volverSaludIntegral() {
    switch (this.saludIntgralBotonVolver.estado) {
      case 'VISTA_DERIVACION':
        this.nuevaReserva()
        break;
      case 'VISTA_AGENDA_PROFESIONAL':
        this.utils.actionSaludIntegralVolver().setVolver('VISTA_AGENDA_PROFESIONAL')
        break;
      case 'VISTA_CALENDARIO':
          this.utils.actionSaludIntegralVolver().setVolver('VISTA_CALENDARIO');
          break;
    }
  }

  confirmarReserva(data) {
    if (data['response']) {
      this.reservaRealizada = true;
      this.listaEsperaData = null;
      this.codCita = data['data']['codCita'];
      this.cambiarEtapa(4);
    }
  }

  busquedaEmitter(data) {
    if (data && data.area && data.especialidad) {
      this.busquedaInfo = data;
      this.cambiarEtapa(1);
    }
  }

  anularhHora(){
    this.router.navigate(['/anular-reserva'])
    gtag('event', 'Filtro de Búsqueda', { 'event_category': 'Anular Hora', 'event_label': `Anular`, 'value': '0' });

  }
  getParamsArea() {

    this.aRouter.params.subscribe(params => {
      if (params['area'] === 'saludintegral') {
        if (!ENV.activarSaludIntegral) {
          location.href = "/";
        }
        this.saludIntegral = true;
        setTimeout(() => {
          this.readQuery = true;
        }, 2000)
      }
      this.checkSaludIntegral = true;
    })

  }

  ngOnInit() {

    this.getParamsArea();
    this.emitterReloadBusqueda = this.utils.getReloadBusqueda().subscribe(r => {
      this.cambiarEtapa(1);
      this.reloadNumber = this.utils.aleatorio(1, 99999);
    });

  }

  irPortalPacientes() {
    window.location.href = "https://agenda.clinicasancarlos.cl/";
  }

  ngOnDestroy() {
    this.emitterReloadBusqueda.unsubscribe();
    this.buscarProfesionalRelacionadoSuscription.unsubscribe();
    this.resetReservaObj.unsubscribe();
  }

  cambiarEtapa(index: number) {

    this.curEtapa = index;
    this.tabGroup.selectedIndex = this.curEtapa;

    if (index < 2) {
      this.listaEsperaData = null;
      this.isProcedimiento = false;
    }

    window.scrollTo(0, 0);

  }

  nuevaReserva(fromBtn = false) {

    this.utils.reiniciarReserva();
    this.utils.resetPaciente();
    this.busquedaInfo = null
    this.paciente = null;
    this.calendario = null
    this.reservaRealizada = null;
    this.listaEsperaData = null;
    this.confirmacionListaEsperaData = null;
    this.isProcedimiento = false;
    this.confirmacionProcedimiento = null;
    this.cambiarEtapa(0);

    if (this.saludIntegral && fromBtn) {
      this.utils.actionNuevaHoraSaludIntegral().setNuevaHora(true);
    }

    gtag('event', 'Reserva Exitosa', { 'event_category': 'Tomar otra hora', 'event_label': 'Nueva Hora' , 'value': '0' });

  }

  resetReserva() {
    setTimeout(() => {
      this.nuevaReserva();
    }, 1000)

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

  reservar() {
    this.utils.setEmitReservar()
  }

  setDatosBeneficiario(data) {

    this.datosBeneficiarioMedico = data;
    this.busquedaInfo = data;
    this.verMedicoAsociado = true;
    this.readQuery = false;
    this.cambiarEtapa(1);

    setTimeout(() => {
      this.readQuery = true;
      this.utils.hideProgressBar();
    }, 2000);

  }

  nuevaBusquedaCM() {

    this.utils.showProgressBar();
    this.readQuery = false;
    this.verMedicoAsociado = false;
    this.datosBeneficiarioMedico = null;
    this.rutMatch = null;
    setTimeout(() => {
      this.readQuery = true;
      this.utils.hideProgressBar();
    }, 1500);

  }

  listaEspera(data) {
    this.listaEsperaData = data;
    this.cambiarEtapa(2);
  }

  setProcedimiento() {
    this.isProcedimiento = true;
    this.cambiarEtapa(2);
  }
}
