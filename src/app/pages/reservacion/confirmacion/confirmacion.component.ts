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
import { ENV } from 'src/environments/environment';

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

    this.disableBarReserva = true;
    let adicionalData = {};
    let fecha: any = this.utils.toLocalScl(this.calendario.cupo.fechaHora, this.calendario.cupo.compensacion);
    let postData = {
      fechaInicioDesde: fecha,
      idCentro: this.calendario.cupo.centro.id,
      duracion: this.calendario.cupo.duracion,
      idPaciente: this.paciente.adicional.documento,
      idServicio: this.busquedaInicial.especialidad.idServicio,
      idPlanCobertura: this.paciente.adicional.prevision.idPlan
    }


    if (this.busquedaInicial.area.id === 'RIS_IMAGENES') {

      adicionalData = {
        idArea: 'RIS_IMAGENES',
        idEncuesta: this.busquedaInicial.datosImagenes.idEncuesta,
        requierePresupuesto: this.busquedaInicial.datosImagenes.requierePresupuesto ? 1 : 0,
        ordenMedica: this.busquedaInicial.datosImagenes.archivo.file64,
      }

    } else {

      adicionalData = {
        idRecurso: this.calendario.recurso.id,
        tipoIdPaciente: this.paciente.adicional.tipoDocumento,
        paisIdentificador: 'CL',
        idDisponibilidad: this.calendario.cupo.disponibilidad.id,
        idTipoCita: this.calendario.cupo.idTipoCita.id
      }
    }

    postData = { ...postData, ...adicionalData }


    this.agendaService.postCita(postData).subscribe((data: any) => {

      if (data['statusCod'] == 'OK') {

        this.reservaFinalizada = true;
        this.idreserva = data['idCita'];
       
        gtag('config', ENV.analyticsCode, 
        {'page_path': `/busqueda/especialidad/area/${this.busquedaInicial.area.id}/profesional/${this.calendario.recurso.id}servicio/${this.busquedaInicial.especialidad.idServicio}/centro/${this.busquedaInicial.centroAtencion.idCentro}/cupo/reservado/${data['idCita']}` });
    
        if (data.hasOwnProperty('listaRecetas') && data.listaRecetas.length > 0) {
          this.setListaRecetas(data.listaRecetas);
        }

        this.confirmarReserva.emit({ response: true, data: data });

      } else {

        this.errReserva(data['usrMsg']);

      }
      this.disableBarReserva = false;
    })

  }

  setListaRecetas(items) {

    const mensajes = [];
    mensajes.push({ mensaje: { contenido: `<b style="margin: 20px 0px;font-weight: bold;font-size: 16px; display:block;">Documentos de la Cita:</b>` } });
    items.forEach((val, key) => {
      mensajes.push({ mensaje: { contenido: `<p style="margin:0px !important">- <a href="${val.urlReceta}" target="_blank">${val.nombreReceta}</a></p>` } });
    });

    this.mensajes = this.mensajes.concat(mensajes);
    this.onResize();
    
  }

  errReserva(message) {

    let msg = (message) ? message : 'Se ha producido un error. ¿Que desea hacer?';

    let dialogRef = this.dialog.open(ErrorReservaComponent, {
      width: '720px',
      data: { message: msg },
      autoFocus: false,
      disableClose: true
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
          height: '',
        })
      }
    }
  }

  setVerMas(action) {
    if (action === 'open') {
      this.verMasOpened = true;
      $("#contIndic").css({
        height: '',
        paddingBottom: '30px'
      })
    } else {
      this.verMasOpened = false;
      this.verMas();
    }
  }

  pagar() {
    gtag('event', 'Reserva Exitosa', { 'event_category': 'Pagar Reserva', 'event_label': 'Pagar' , 'value': '0' });
    location.href = 'https://cmv.ucchristus.cl/pago/reserva/' + this.idreserva;
  }

  anularReserva() {

    const data = {
      fromReserva: true,
      nombreProfesional: this.calendario.recurso.nombre,
      fechaHora: this.calendario.cupo.fechaHora,
      compensacion: this.calendario.cupo.compensacion,
      IdArea: this.busquedaInicial.area.id,
      nombreEspecialidad: this.busquedaInicial.especialidad.detalle,
      nombreServicio: this.busquedaInicial.especialidad.nombreServicio
    };

    let dialogConfirm = this.dialog.open(ConfirmarAnularReservaComponent, {
      data: data,
      width: '640px',
      autoFocus: false
    });

    dialogConfirm.componentInstance.dialogEvent.subscribe(result => {

      if (result) {

        const dataCita = {
          idCita: this.idreserva,
          codPaciente: this.busquedaInicial.documentoPaciente.documento,
          tipoIdPaciente: this.busquedaInicial.documentoPaciente.tipoDocumento,
          paisIdentificador: 'CL',
          codEstado: 'ANULADA'
        }

        this.agendaService.cambiarEstadoCita(dataCita).subscribe(res => {

          if (res['statusCod'] == 'OK') {
            this.anulada = true;
            this.successMsg = '¡Reserva ha sido anulada correctamente!';
            gtag('event', 'Reserva Exitosa', { 'event_category': 'Anular Reserva', 'event_label': 'Anular' , 'value': '0' });
          } else {
            this.utils.mDialog("Error", "La Hora ha sido no pudo ser anulada. Intente nuevamente.", "message");
          }

        });
      }
    });
  }
}

