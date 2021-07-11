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
  validarEnrolamiento: 'http://ecommerceucv2.lfi.cl/ServicioMarcaPaciente/validarenrolamiento',
  idPlanSaludInit: '4c30555e-5ed3-418f-8f54-a91a00ace99b',
  idPlanSaludAdministrada: '018ed73d-6bd2-46e9-8e95-acfc0134435b',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
  mensajeSinCupos: '<h5>Estimado paciente, actualmente no encontramos citas disponibles en el centro de su elección. Intente nueva búsqueda en todos los centros.</h5>',
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
  idRegion: '6bad9b25-d5df-4565-b5fe-a6f701444053',
  saludIntegral:{
    idEspecialidad: '507ef9a7-0d7e-41b8-ae09-a93400e5d5c8',
    idServicio: '507ef9a7-0d7e-41b8-ae09-a93400e5d5c8'
  },
  idOcultarServicios:[
    'd6d84ad5-b78c-4527-8316-ad3900da30ee',
    'eb29c47f-1774-4e0f-9a5d-ab8e00fc5716'],
  ginecologia:{
    nombre:'GINECOLOGIA Y OBSTETRICIA',
    idEspecialidad:'b6fb250f-fff4-4f6e-9436-a93400e4d00d',
    idServicio:'8193f6de-8308-420e-9309-a934015b1999'
  },
  oftalmologia:{
    nombre:'OFTALMOLOGIA',
    idEspecialidad:'274daf84-5ed6-4e8c-bbf0-a93400e91bd4',
    idServicio:'a163c23a-285a-4e9a-9e37-a934015b223e'
  },
  planesSaludOcultos:['018ed73d-6bd2-46e9-8e95-acfc0134435b'],
  tokenAutenticar: 'T3BMdXo5ckdJaXlvY0FJNg==',
  pathAutenticar: '/auth-test/Autenticar',
  analyticsCode: 'UA-143119471-1',
  activarSaludIntegral: true,
  bloquearAreaRadiologia:true,
  pathUsuarios:'/auth-test',
  derivaciones:{
    url:"http://ecommerceucv2.lfi.cl/ServicioMarcaPaciente/token",
    consultaDerivacion: "http://ecommerceucv2.lfi.cl/serviciomarcapaciente/consultaderivacion",
    user : "UCCHRISTUS",
    pass : "VsqBYUpyQabwx5mx1Tit" , 
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMjYwNDIwMjExNDU5MzFVQ0NIUklTVFVTMjYwNDIwMjExNDU5MzEiLCJuYmYiOjE2MTk0NjM1NzEsImV4cCI6MTYxOTQ2Mzg3MSwiaWF0IjoxNjE5NDYzNTcxfQ.aoXUdgVsR1m-M_3jY8jTAiXT9qT_V2wL8Ngm9k6-EoE"
  }
}

export const EspecialidadesDerivaciones = [
  { 
    idEspecialidad: 'b6fb250f-fff4-4f6e-9436-a93400e4d00d',
    idServicio: 'a163c23a-285a-4e9a-9e37-a934015b223e',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Consulta Médica'
  },
  { 
    idEspecialidad: '274daf84-5ed6-4e8c-bbf0-a93400e91bd4',
    idServicio: '8193f6de-8308-420e-9309-a934015b1999',
    nombre: 'OFTALMOLOGIA - Consulta Médica'
  }
]

/*
export const ENV = {
  baseApi: 'https://apigw.ucchristus.cl',
    servRoute: '/agendaambulatoria-prod',
    profRoute: '/profesionales-prod',
    validarEnrolamiento: 'http://ecommerceucv2.lfi.cl/serviciosaludintegral/validarenrolamiento',
    idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
    idCentrosNoDisponibles: [],
    idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
    mensajeSinCupos : '<h5>Estimado paciente, actualmente no encontramos citas disponibles en el centro de su elección. Intente nueva búsqueda en todos los centros.</h5>',
    idExamenProcedimiento: 'b2461ac2-9c50-4724-9676-a91a00a91a02',
    idLaboratorioClinico: 'baa46005-a0ff-4715-a074-ac4601235504',
    areaConsultaMedica: {
      id: '2a8202d9-1ebd-4f2e-a359-a91a00a91a02',
      nombre: 'Consultas'
    },
    donacionBancoDeSangre: {
      idEspecialidad: '2ae24ffb-8c57-4943-adcd-abd400f8271c',
      idServicio : '02560c8e-0c28-4e88-9eb4-abd400f8b282'
    },
    idRegion: '6bad9b25-d5df-4565-b5fe-a6f701444053',
    saludIntegral:{
      idEspecialidad: '507ef9a7-0d7e-41b8-ae09-a93400e5d5c8',
      idServicio: '507ef9a7-0d7e-41b8-ae09-a93400e5d5c8'
    }
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
  profesionalesSimilares: [
    {
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
    {
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
    {
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
    {
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
    {
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
    {
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
    }
  ]
}


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
