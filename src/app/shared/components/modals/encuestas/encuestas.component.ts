import { ReturnStatement } from '@angular/compiler';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AgendaAmbulatoriaService } from 'src/app/services/agenda-ambulatoria.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.scss']
})
export class EncuestasComponent implements OnInit {

  @Output() public dialogEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('tabGroup', { static: false }) tabGroup: any;

  curPregunta = 1;
  init = false;
  preguntas = [];
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inp: { encuesta: any, idEncuesta: number, documento: string },
    public dialogRef: MatDialogRef<EncuestasComponent>,
    public agendaService: AgendaAmbulatoriaService,
    public utils: UtilsService
  ) {
    console.log(this.inp)
    this.preguntas = this.inp.encuesta;

  }

  ngOnInit() {
    setTimeout(() => {
      this.init = true;
    }, 1500)
  }

  test() {
    console.log(this.preguntas)
  }

  async confirmar(action) {

    if (action) {
      const data = {
        idPaciente: this.inp.documento,
        idEncuesta: String(this.inp.idEncuesta),
        respuestas: []
      }
      console.log(this.preguntas)

      this.preguntas.forEach((val, key) => {

        if (val.tipo === 'seleccion_unitaria') {
          data.respuestas.push({ idPregunta: String(val.idPregunta), respuestasOpcion: [val.seleccion.idOpcion] })
        }

        if (val.tipo === 'seleccion_multiple') {
          const opciones = [];
          val.opciones.forEach((vop, vopk) => {
            if (vop.enable) {
              opciones.push(vop.idOpcion)
            }
          });

          data.respuestas.push({ idPregunta: String(val.idPregunta), respuestasOpcion: opciones })

        }

      });
      this.loading = true;
      const resp: any = await this.agendaService.postEncuesta(data);

      let mensajes = '';
      if(resp.mensaje){
        resp.mensaje.forEach((val, key) => {
          mensajes += `<p>${val}</p>`;
        });
      }

      if(mensajes !== ''){
        this.utils.mDialog("Estimado Paciente", mensajes, 'message');
      }

      if (resp.resultado && resp.resultado.toUpperCase() === 'NEGATIVO') {

        action = false;

      } else if (resp.resultado && (resp.resultado.toUpperCase() === 'POSITIVO' || resp.resultado.toUpperCase().includes('PRECAUC'))) {

        action = false;

      } else {

        this.utils.mDialog("Error", 'No se pudo evaluar la encuesta. Intente de nuevo más tarde.', 'message');
        this.loading = false;

        return;
      }

      this.loading = false;
    }


    this.dialogEvent.emit(action);
    this.dialogRef.close();
  }
}
