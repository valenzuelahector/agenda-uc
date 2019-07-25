import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { AgendaAmbulatoriaService } from  'src/app/services/agenda-ambulatoria.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss']
})
export class ConfirmacionComponent implements OnInit, OnChanges {

  public reservaFinalizada:boolean = false;

  @Input() paciente:any;
  @Input() calendario:any;
  @Input() busquedaInicial:any;

  @Output() confirmarReserva:EventEmitter<any> = new EventEmitter();

  constructor(
    public agendaService:AgendaAmbulatoriaService,
    public utils:UtilsService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.paciente);
    console.log(this.calendario);
    console.log(this.busquedaInicial);
  }

  reservar(){
    this.utils.mDialog("Confirmación", "¿Está seguro que desea confirmar la reserva?", "confirm").subscribe(r => {
      if(r){

        let fecha:any = this.utils.trDateStr(this.calendario.cupo.fechaHora, 'n');

        this.agendaService.postCita({
          fechaInicioDesde: fecha,
          idCentro: this.calendario.cupo.idStrCentro,
          idRecurso: this.calendario.recurso.id,
          idServicio: this.busquedaInicial.especialidad.idServicio,
          duracion: this.calendario.cupo.duracion,
          idPaciente: this.paciente.adicional.documento,
          tipoIdPaciente: this.paciente.adicional.tipoDocumento,
          paisIdentificador: 'CL',
          idPlanCobertura: this.paciente.adicional.prevision.idPlan,
          idDisponibilidad: this.calendario.cupo.idStrDisponibilidad,
        }).subscribe(data => {
          if(data['statusCod'] == 'OK'){
            this.reservaFinalizada =  true;
            this.confirmarReserva.emit({response: true, data:data});
          }else{
            this.utils.mDialog("Error", data['usrMsg'], "message");
          }
        })
      }
    })
  }
}
