// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true
};

export const ENV = {
  baseApi: 'https://apigw.ucchristus.cl',
  servRoute: '/agendaambulatoria-prod',
  profRoute: '/profesionales-prod',
  validarEnrolamiento: 'https://www.miplansaludplus.cl/ServicioMarcaPaciente/validarenrolamiento',
  idPlanSaludInit: '0b7a577d-6364-4b28-b2ba-a96e00e243ac',
  idPlanSaludAdministrada: '427cd404-170c-4c11-84eb-ad5800d103ab',
  idCentrosNoDisponibles: [],
  idCentroPrioritario: '52e43c90-8ab7-4e34-afcb-a96f0106bbd1',
  mensajeSinCupos: '<h5>Estimado paciente, actualmente no encontramos citas disponibles en el centro de su elección. Intente nueva búsqueda en todos los centros.</h5>',
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
  },
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
  pathAutenticar: '/auth-prod/Autenticar',
  analyticsCode: 'UA-143119471-1',
  activarSaludIntegral: true,
  bloquearAreaRadiologia:false,
  pathUsuarios:'/auth-test',
  derivaciones:{
    url:"https://www.miplansaludplus.cl/ServicioMarcaPaciente/token",
    consultaDerivacion: "https://www.miplansaludplus.cl/serviciomarcapaciente/consultaderivacion",
    user : "UCCHRISTUS",
    pass : "VsqBYUpyQabwx5mx1Tit" , 
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMjYwNDIwMjExNDU5MzFVQ0NIUklTVFVTMjYwNDIwMjExNDU5MzEiLCJuYmYiOjE2MTk0NjM1NzEsImV4cCI6MTYxOTQ2Mzg3MSwiaWF0IjoxNjE5NDYzNTcxfQ.aoXUdgVsR1m-M_3jY8jTAiXT9qT_V2wL8Ngm9k6-EoE"
  }
}

export const EspecialidadesDerivaciones = [
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: 'C077673A-F34F-4EBD-BF55-A9A60142B7C6',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Climaterio y Menopausia'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: 'CFFC6DE4-B9B9-465D-A2F3-A98A00F1E20C',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Embarazo Alto Riesgo'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: 'D73DEAE9-B650-4B52-85A5-AC4D00ED61BD',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Embarazo Alto Riesgo TLM'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: '16BA1416-2CC9-4CE4-980C-A98A00F1E2D6',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Ginecología'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: 'A6C6D480-C95B-4BED-9781-A98A00F1E27C',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Ginecología Endocrinológica'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: '556E1B9F-9D86-466C-BF96-A98A00F1E148',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Ginecología Pediátrica y Adolescente'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: '2BD5CA83-0D9C-4877-8EFB-AB9D00CBC695',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Ginecología Pediátrica y Adolescente TLM'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: '24922420-11EA-4226-99DE-A99E01458DC8',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Medicina Reproductiva e Infertilidad'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: 'F753935F-DAAF-4983-AD74-A99E01458E4C',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Obstetricia'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: '87A29474-2D4F-401B-8A1C-AB8500B75CB0',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Obstetricia TLM'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: 'B144A551-BB1D-4984-BECE-A98A00F1E333',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Oncología'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: '88EE4CB2-2AEB-4B90-ADD9-ABE400DDBA82',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Oncología TLM'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: '51D39864-3AB8-41E0-8106-A9BA012EC630',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Piso Pélvico'
  },
  { 
    idEspecialidad: 'c4749604-d48f-4f59-96cc-a97400d53190',
    idServicio: '45A7582B-4C34-43F9-A421-A99E0127C59E',
    nombre: 'GINECOLOGIA Y OBSTETRICIA - Seguimiento Folicular'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: 'CF42CC82-5943-4439-8933-A98A00F1FF25',
    nombre: 'OFTALMOLOGÍA - Cornea'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: 'E3397EAF-079E-42B9-A470-A98A00F20022',
    nombre: 'OFTALMOLOGÍA - Estrabismo Pediátrico'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: '5CD30FEB-5EB2-44DD-B67F-A99E0127F75A',
    nombre: 'OFTALMOLOGÍA - Estudio de Estrabismo'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: 'CFCA0090-8A92-4B17-AA65-A98A00F1FE8F',
    nombre: 'OFTALMOLOGÍA - General Adultos'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: 'E3E439E3-C937-416C-923A-A98A00F20213',
    nombre: 'OFTALMOLOGÍA - General Pediátrica'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: '2B04E6A9-10C8-4C88-A47C-A98A00F20120',
    nombre: 'OFTALMOLOGÍA - Neurooftalmología'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: 'C10B0026-D94B-472F-A044-A98A00F2019A',
    nombre: 'OFTALMOLOGÍA - Orbita y Plástica'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: '5167B576-D4C3-4CC5-B5F9-A98A00F20322',
    nombre: 'OFTALMOLOGÍA - Retina'
  },
  { 
    idEspecialidad: '87e8bd30-2f07-4c49-b379-a97400d804f0',
    idServicio: '46526907-5BA7-48CA-A0CF-AA30015359E9',
    nombre: 'OFTALMOLOGÍA - Uveítis'
  },

]


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
