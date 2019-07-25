import { Injectable } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgendaAmbulatoriaService {

  public servRoute:string = '/agendaambulatoria-test'
  public profRoute:string = '/profesionales-test'
  public baseApi:string;
  public httpOptions: any;

  constructor(public http:HttpClient) {
    this.baseApi = ENV.baseApi + this.servRoute;
    this.httpOptions = {
      headers: new HttpHeaders({
        'X-AppTimezone' : "-180",
        'Content-Type'  : "application/json; odata.metadata=minimal"
      })
    };
  }

  getAreas(){
    return this.http.get(this.baseApi + '/Areas');
  }

  getEspecialidadesByGeneric(idArea:any){
    return this.http.get(this.baseApi + '/Servicios/Rel/Especialidades?idArea=' + idArea);
  }

  getEspecialidadesByProfesional(idProfesional:string){
    return this.http.get(this.baseApi + '/Servicios/Rel/Especialidades?idProfesional=' + idProfesional);
  }

  getProfesionales(idArea:string){
    return this.http.get(this.baseApi + '/Profesionales?idArea=' + idArea);
  }

  getCentrosByEspecialidad(idServicio:string){
    return this.http.get(this.baseApi + '/Centros?idServicio=' + idServicio);
  }

  getRecursos(queryData:any){
    let queryProfesional = (queryData.idProfesional) ? '&profesional=' + queryData.idProfesional : '';
    let queryCentro = (queryData.idCentro != 0) ? '&idCentro=' + queryData.idCentro : '&idCentro=';

    return this.http.get(this.baseApi +
      '/Agenda/CuposEspecCentro?fechaInicio=' + queryData.fechaInicio +'&fechaTermino=' + queryData.fechaTermino +
      '&idServicio=' + queryData.idServicio + '&idPlanSalud=' + queryData.idPlanSalud + queryProfesional  + queryCentro
  );
  }

  getPaciente(idn:string, tipoIdPaciente:string){
    return this.http.get(this.baseApi + '/Pacientes?idPaciente='+idn+'&tipoIdPaciente='+tipoIdPaciente+'&paisIdentificador=CL');
  }

  postPaciente(data:any){
    return this.http.post(this.baseApi + '/Pacientes', data, this.httpOptions);
  }

  postCita(data:any){
    return this.http.post(this.baseApi + '/Citas', data, this.httpOptions);
  }

  getPlanesSalud(){
    return this.http.get(this.baseApi + '/PlanesDeSalud');
  }

  getDatosProfesional(idProfesional:any){
    return this.http.get(ENV.baseApi + this.profRoute + '/Perfil?idProfesional=' + idProfesional + "&tipoIdProfesional=PRM");

  }
}
