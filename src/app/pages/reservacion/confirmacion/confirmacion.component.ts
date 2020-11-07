import { Component, OnInit, Input, Output, EventEmitter, OnChanges, HostListener, OnDestroy } from '@angular/core';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { UtilsService } from 'src/app/services/utils.service';
import { DomSanitizer } from '@angular/platform-browser';
import gtag, { install } from 'ga-gtag';
import { ErrorReservaComponent } from 'src/app/shared/components/modals/error-reserva/error-reserva.component';
import { ConfirmarAnularReservaComponent } from 'src/app/shared/components/modals/confirmar-anular-reserva/confirmar-anular-reserva.component';
import { MatDialog } from '@angular/material';
import * as $ from 'jquery';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss']
})
export class ConfirmacionComponent implements OnInit, OnChanges, OnDestroy {

  //public reservaFinalizada:boolean = false;

  @Input() paciente: any;
  @Input() calendario: any;
  @Input() busquedaInicial: any;
  @Input() reservaFinalizada: boolean;
  @Output() confirmarReserva: EventEmitter<any> = new EventEmitter();
  @Output() confirmarAnular: EventEmitter<any> = new EventEmitter();
  @Input() mensajes: any = [];

  disableExpand = true;
  disableBarReserva = false;
  expanded = { reserva: true, info: true }
  reservaSubscribe;
  resetReservaSubscribe;
  verMasOpened = false;
  verMasAction = false;
  idreserva;
  codCita;
  successMsg = '¡Reserva Exitosa!'
  anulada = false;

  constructor(
    public agendaService: AgendaAmbulatoriaService,
    public utils: UtilsService,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.onResize();
    
    this.reservaSubscribe = this.utils.getEmitReservar().subscribe(res => {
      this.reservar();
    });

    this.resetReservaSubscribe = this.utils.getReiniciarReserva().subscribe(res => {
      this.anulada = false;
      this.verMasOpened = false;
      this.verMasAction = false;
      this.successMsg = '¡Reserva Exitosa!';
      this.disableExpand = true;
      this.disableBarReserva = false;
    });

  }

  ngOnChanges() {
    this.onResize();
    setTimeout(() => {
      this.verMas();
      this.setVerMas('close')
      this.successMsg = '¡Reserva Exitosa!'
    }, 300)
  }

  ngOnDestroy() {
    this.reservaSubscribe.unsubscribe();
    this.resetReservaSubscribe.unsubscribe();
  }

  reservar() {
    
    let fecha: any = this.utils.toLocalScl(this.calendario.cupo.fechaHora, this.calendario.cupo.compensacion);
    this.disableBarReserva = true;
    this.agendaService.postCita({
      fechaInicioDesde: fecha,
      idCentro: this.calendario.cupo.centro.id,
      idRecurso: this.calendario.recurso.id,
      idServicio: this.busquedaInicial.especialidad.idServicio,
      duracion: this.calendario.cupo.duracion,
      idPaciente: this.paciente.adicional.documento,
      tipoIdPaciente: this.paciente.adicional.tipoDocumento,
      paisIdentificador: 'CL',
      idPlanCobertura: this.paciente.adicional.prevision.idPlan,
      idDisponibilidad: this.calendario.cupo.disponibilidad.id,
      idTipoCita: this.calendario.cupo.idTipoCita.id
    }).subscribe(data => {
      if (data['statusCod'] == 'OK') {
        this.reservaFinalizada = true;
        this.idreserva = data['idCita'];
        this.codCita = data['codCita'];
        
        if(this.busquedaInicial.fromCuposInmediatos){
          gtag('event', 'Reserva Cupos Inmediatos', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso5:Reserva-Confirmada' });
        }

        if(this.busquedaInicial.fromMedicosRelacionados){
          gtag('event', 'Reserva Profesional Relacionado', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso5:Reserva-Confirmada' });
        }

        if(this.busquedaInicial.gtagActionName){
          gtag('event', this.busquedaInicial.gtagActionName, { 'event_category': this.busquedaInicial.gtagName, 'event_label': `k) ETAPA 4: RESERVA CONFIRMADA`, 'value': '0' });
          gtag('event', this.busquedaInicial.gtagActionEspProf, { 'event_category': this.busquedaInicial.gtagNameEsp, 'event_label': `k) ETAPA 4: RESERVA CONFIRMADA`, 'value': '0' });

        }

        this.confirmarReserva.emit({response: true, data:data});

      } else {

        this.errReserva(data['usrMsg']);

      }
      this.disableBarReserva = false;
    })

    gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso4:Confirmación' });

  }

  errReserva(message) {

    let msg = (message) ? message : 'Se ha producido un error. ¿Que desea hacer?';

    let dialogRef = this.dialog.open(ErrorReservaComponent, {
      width: '720px',
      data: { message: msg },
      autoFocus: false,
      disableClose:true
    });

    dialogRef.componentInstance.dialogEvent.subscribe((result) => {
      this.utils.setReloadBusqueda();
    })

  }

  @HostListener('window:resize', [])
  onResize(): void {

    if (window.innerWidth <= 960) {
      this.disableExpand = false;
    } else {
      this.disableExpand = true;
      this.expanded = { reserva: true, info: true }
    }

    this.verMas();
  }

  verMas() {

    const hDatosReserva = $("#contDatosReserva").height();
    const hIndic = $("#contIndic").height();
    if (hDatosReserva !== undefined) {
      if (hIndic > hDatosReserva) {
        this.verMasAction = true;
        $("#contIndic").css({
          height: (hDatosReserva + 42) + 'px'
        })
      } else {
        this.verMasAction = false;
        $("#contIndic").css({
          height: ''
        })
      }
    }
  }

  setVerMas(action) {
    if (action === 'open') {
      this.verMasOpened = true;
      $("#contIndic").css({
        height: ''
      })
    } else {
      this.verMasOpened = false;
      this.verMas();
    }
  }

  pagar() {
    location.href = 'https://cmv.ucchristus.cl/pago/reserva/' + this.idreserva
  }

  anularReserva() {

    const data = {
      fromReserva: true,
      nombreProfesional: this.calendario.recurso.nombre,
      fechaHora: this.calendario.cupo.fechaHora,
      compensacion: this.calendario.cupo.compensacion
    };

    let dialogConfirm = this.dialog.open(ConfirmarAnularReservaComponent, {
      data: data,
      width: '640px',
      autoFocus: false
    });

    dialogConfirm.componentInstance.dialogEvent.subscribe(result => {

      if (result) {

        const dataCita = {
          codCita: this.codCita,
          codPaciente: this.busquedaInicial.documentoPaciente.documento,
          tipoIdPaciente: this.busquedaInicial.documentoPaciente.tipoDocumento,
          paisIdentificador: 'CL',
          codEstado: 'ANULADA'
        }

        this.agendaService.cambiarEstadoCita(dataCita).subscribe(res => {

          if (res['statusCod'] == 'OK') {
            this.anulada = true;
            this.successMsg = '¡Reserva ha sido anulada correctamente!';
            gtag('event', this.busquedaInicial.gtagActionName, { 'event_category': this.busquedaInicial.gtagName, 'event_label': `l) RESERVA CONFIRMADA HA SIDO ANULADA`, 'value': '0' });
            gtag('event', this.busquedaInicial.gtagActionEspProf, { 'event_category': this.busquedaInicial.gtagNameEsp, 'event_label': `l) RESERVA CONFIRMADA HA SIDO ANULADA`, 'value': '0' });
  
          } else {
            this.utils.mDialog("Error", "La Hora ha sido no pudo ser anulada. Intente nuevamente.", "message");
          }

        });
      }
    });
  }
}

