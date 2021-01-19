// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true
};


export const ENV = {
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-test',
  profRoute: '/profesionales-test',
  idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
  mensajeSinCupos: '<h5>No se encontraron cupos disponibles.</h5>',
  idExamenProcedimiento: '97bd5208-60d1-4d6c-9d1e-a96e00ddbc15',
  idLaboratorioClinico: '86399d7e-7bd3-4bed-b18a-aca100fc732c',
  areaConsultaMedica: {
    id: '2a8202d9-1ebd-4f2e-a359-a91a00a91a02',
    nombre: 'Consultas'
  },
  donacionBancoDeSangre: {
    idEspecialidad: '2ae24ffb-8c57-4943-adcd-abd400f8271c',
    idServicio : '02560c8e-0c28-4e88-9eb4-abd400f8b282'
  },
  idRegion: '6bad9b25-d5df-4565-b5fe-a6f701444053'
}
/*
export const ENV = {
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-prod',
  profRoute: '/profesionales-prod',
  idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
  mensajeSinCupos : '<h5>Sin disponibilidad en agendamiento web. En caso de requerir atención presencial para vacunación por campaña influenza ministerial, ésta será por orden de llegada.</h5>'
}*/
/*
export const ENV = {
  
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-prod',
  profRoute: '/profesionales-prod',
  idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
  mensajeSinCupos : '<h5>Sin disponibilidad en agendamiento web. En caso de requerir atención presencial para vacunación por campaña influenza ministerial, ésta será por orden de llegada.</h5>',
  idExamenProcedimiento: 'b2461ac2-9c50-4724-9676-a91a00a91a02',
  areaConsultaMedica: {
    id: '2a8202d9-1ebd-4f2e-a359-a91a00a91a02',
    nombre: 'Consultas'
  },
  donacionBancoDeSangre: {
    idEspecialidad: '2ae24ffb-8c57-4943-adcd-abd400f8271c',
    idServicio : '02560c8e-0c28-4e88-9eb4-abd400f8b282'
  },
  idRegion: '6bad9b25-d5df-4565-b5fe-a6f701444053'

}*/
/*
export const ENV = {
  
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-prod',
  profRoute: '/profesionales-prod',
  idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
  mensajeSinCupos: '<h5>No se encontraron cupos disponibles.</h5>',
  idExamenProcedimiento: '97bd5208-60d1-4d6c-9d1e-a96e00ddbc15',
    areaConsultaMedica: {
    id: '2a8202d9-1ebd-4f2e-a359-a91a00a91a02',
    nombre: 'Consultas'
  },
  donacionBancoDeSangre: {
    idEspecialidad: '2ae24ffb-8c57-4943-adcd-abd400f8271c',
    idServicio : '02560c8e-0c28-4e88-9eb4-abd400f8b282'
  },
  idRegion: '6bad9b25-d5df-4565-b5fe-a6f701444053'
  
}*/
/*
export const ENV = {
  
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-pre',
  profRoute: '/profesionales-pre',
  idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '8ca284cf-482a-4248-bc8f-a92800f90207',
  mensajeSinCupos : '<h5>No se encontraron cupos disponibles.</h5>',
  idExamenProcedimiento: 'b2461ac2-9c50-4724-9676-a91a00a91a02',
  areaConsultaMedica: {
    id: 'aafc27df-882e-413b-bdcd-a96e00ddbc15',
    nombre: 'Consultas'
  },
  idRegion: '6bad9b25-d5df-4565-b5fe-a6f701444053',
  donacionBancoDeSangre: {
    idEspecialidad: '2ae24ffb-8c57-4943-adcd-abd400f8271c',
    idServicio : '02560c8e-0c28-4e88-9eb4-abd400f8b282'
  },

}*/


export const dummyData = {
  profesionalAsignado: {
    proximaHoraEpoch: 1590865927,
    compensacion: 240,
    area: {
      id: "aafc27df-882e-413b-bdcd-a96e00ddbc15",
      nombre: "Consultas"
    },
    profesional: {
      idProfesional: "a5dc511a-fbce-40a7-9999-a9a7012e3f5c",
      nombreProfesional: "PAUL ANDREW MCNAB MARTIN",
      esProfesional: true,
      informacionAdicional: "",
      soloAutoPagador: null,
      urlImagenProfesional: "https://proxy.prod.ucchristus.procloudhub.com/ThirdPartyService/Physicians(a5dc511a-fbce-40a7-9999-a9a7012e3f5c)/GetPicture",
      detalle: "PAUL ANDREW MCNAB MARTIN"
    },
    especialidad: {
      idServicio: "e5a95aa9-9def-49b7-8e76-a98a00f1d150",
      nombreServicio: "Consulta Médica",
      idEspecialidad: "ef03106b-3cfa-4f47-9344-a97400d3c2ae",
      nombreEspecialidad: "CARDIOLOGÍA ADULTOS",
      detalle: "CARDIOLOGÍA ADULTOS - Consulta Médica"
    },
    centroAtencion: {
      idCentro: "52e43c90-8ab7-4e34-afcb-a96f0106bbd1",
      nombre: "Clínica San Carlos de Apoquindo",
      idRegion: "6bad9b25-d5df-4565-b5fe-a6f701444053",
      direccion: {
        calle: "Camino El Alba",
        numero: "12407",
        piso: null,
        comuna: "Las Condes"
      },
      horaApertura: "08:00",
      horaCierre: "20:00",
      latitud: -33.400391,
      longitud: -70.5118382,
      detalle: "Clínica San Carlos de Apoquindo"
    }
  },
  profesionalesSimilares:[]
}
