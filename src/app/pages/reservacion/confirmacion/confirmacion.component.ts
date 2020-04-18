import { Component, OnInit, Input, Output, EventEmitter, OnChanges, HostListener } from '@angular/core';
import { AgendaAmbulatoriaService } from  'src/app/services/agenda-ambulatoria.service';
import { UtilsService } from 'src/app/services/utils.service';
import { DomSanitizer } from '@angular/platform-browser';
import gtag, { install } from 'ga-gtag';
import { ErrorReservaComponent } from 'src/app/shared/components/modals/error-reserva/error-reserva.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss']
})
export class ConfirmacionComponent implements OnInit, OnChanges {

  //public reservaFinalizada:boolean = false;

  @Input() paciente:any;
  @Input() calendario:any;
  @Input() busquedaInicial:any;
  @Input() reservaFinalizada:boolean;
  @Output() confirmarReserva:EventEmitter<any> = new EventEmitter();
  @Input() mensajes:any = [];
  disableExpand = true;
  disableBarReserva = false;

  expanded = { reserva : true, paciente : true }

  constructor(
    public agendaService:AgendaAmbulatoriaService,
    public utils:UtilsService,
    public sanitizer:DomSanitizer,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.onResize();
  }

  ngOnChanges() {
  }

  reservar(){

    let fecha:any = this.utils.toLocalScl(this.calendario.cupo.fechaHora, this.calendario.cupo.compensacion);
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
      if(data['statusCod'] == 'OK'){
        this.reservaFinalizada =  true;
        this.confirmarReserva.emit({response: true, data:data});
      }else{
        this.errReserva(data['usrMsg']);
      }
      this.disableBarReserva = false;
    })

    gtag('event', 'Clic', { 'event_category': 'Reserva de Hora', 'event_label': 'Paso4:Confirmación'});

  }

  errReserva(message){

    let msg = (message) ? message : 'Se ha producido un error. ¿Que desea hacer?';

    let dialogRef = this.dialog.open(ErrorReservaComponent, {
      width: '400px',
      data: { message : msg },
      autoFocus: false
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
      this.expanded = { reserva : true, paciente : true }
    }
  
  }
  
}

