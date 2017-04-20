"use strict";

/**
 * @ngdoc function
 * @name financieraClienteApp.decorator:TextTranslate
 * @description
 * # TextTranslate
 * Decorator of the financieraClienteApp
 */
var text_es = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
  //NOTIFICACIONES
  NOTIFICACION_PENDIENTE: "Notificaciones Pendientes",
  NOTIFICACION_VISTA: "Notificaciones Vistas",
  FILTRO_NOTIFICACION: "Filtrar notificación",

  //GENERALES
  CLASIFICACION: "Clasificación",
  CODIGO_PADRE: "Código Padre",
  CODIGO: "Código",
  NOMBRE: "Nombre",
  DESCRIPCION: "Descripción",
  NATURALEZA: "Naturaleza",
  SALDO: "Saldo",
  DISPONIBLE: "Disponible",
  VIGENCIA: "Vigencia",
  FECHA_CREACION: "Fecha Creación",
  TIPO_DOCUMENTO: "Tipo Documento",
  ESTADO: "Estado",
  OPERACION: "Operación",
  ENTIDAD: "Entidad",
  UNIDAD_EJECUTORA: "Unidad Ejecutora",
  SELECCION_UNIDAD_EJECUTORA: "Seleccionar Unidad Ejecutora",
  DETALLE_UNIDAD_EJECUTORA: "Detalle Unidad Ejecutora",
  PROVEEDOR: "Proveedor",
  SELECCIONE_PROVEEDOR: "Seleccionar Proveedor",
  DETALLE_PROVEEDOR: "Detalle Proveedor",
  REGISTRO_PRESUPUESTAL: "Certificado Registro Presupuestal",
  SELECCIONE_CRP: "Seleccione CRP",
  DETALLE_CRP: "Detalle CRP",


  // PROVEEDOR
  TIPO_PERSONA: "Tipo Persona",
  NO_DOCUMENTO: "No. Documento",
  DIRECCION: "Dirección",
  TELEFONO: "Teléfono",
  CUENTA_BANCARIA: "Cuenta Bancaria",
  SUCURSAL: "Sucursal",
  TIPO_CUENTA: "Tipo Cuenta",

  //REGISTRO PRESUPUESTAL
  NO_CRP: "No. CRP",
  RESPONSABLE: "Responsable",
  VALOR_CRP: "Valor CRP",
  NO_CDP: "NO. CDP",
  COMPROMISO: "Compromiso",
  DESCRIPCION_COMPROMISO: "Descripción Compromiso",




  //PLAN DE CUENTAS
  PLANES_CUENTAS: "Planes de Cuentas",
  NUEVO_PLAN_CUENTAS: "Crear Nuevo Plan de cuentas",
  INGRESE_NOMBRE_PLAN_CUENTAS: "Ingresa el nombre del plan de cuentas",
  DESCRIPCION_PLAN: " Descripción del nuevo plan...",
  PLAN_CUENTAS_MAESTRO: "Plan de Cuentas Maestro",
  NUEVA_CUENTA: "Nueva Cuenta",

  //DIRECTIVE/CUENTAS_CONTABLES/PLANES_CUENTAS
  D_PLANES_CUENTA: {
    LISTADO_PLAN_CUENTAS: "Listado de Planes de Cuentas",
    NO_FILAS: "Número de Filas"
  },
  BTN: {
    VER: "Ver",
    SELECCIONAR: "Seleccionar",
    CANCELAR: "Cancelar",
    CONFIRMAR: "Confirmar",
    AGREGAR: "Agregar",
    REGISTRAR: "Registrar",
    SOLICITAR_RP:"Solicitar RP",
    QUITAR_RUBRO: "Quitar",
  },
  // Ordenes de Pago

  //Rubro
  REGISTRO_RUBRO: "Registro de Rubro",
  CONSULTA_RUBRO: "Consulta de Rubros"
};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop",
  //NOTIFICACIONES
  NOTIFICACION_PENDIENTE: "Notificaciones Pendientes",
  NOTIFICACION_VISTA: "Notificaciones Vistas",
  FILTRO_NOTIFICACION: "Filtrar notificación",

  //GENERALES
  CLASIFICACION: "Classification",
  CODIGO_PADRE: "Father Code",
  CODIGO: "Code",
  NOMBRE: "Name",
  DESCRIPCION: "Description",
  NATURALEZA: "Naturaleza",
  SALDO: "Saldo",
  DISPONIBLE: "Disponible",
  VIGENCIA: "Validity",
  FECHA_CREACION: "Creation Date",
  TIPO_DOCUMENTO: "Document Type",
  ESTADO: "State",
  OPERACION: "Operation",
  ENTIDAD:"Entity",
  UNIDAD_EJECUTORA: "Executing Unit",
  SELECCION_UNIDAD_EJECUTORA: "Select Executing Unit",
  DETALLE_UNIDAD_EJECUTORA: "Detail Executing Unit",
  PROVEEDOR:"Provider",
  SELECCIONE_PROVEEDOR: "Select Provider",
  DETALLE_PROVEEDOR: "Detail Provider",
  REGISTRO_PRESUPUESTAL: "Certificate Registry Budget",
  SELECCIONE_CRP: "Select CRP",
  DETALLE_CRP: "Detail CRP",


  // PROVEEDOR
  TIPO_PERSONA: "Type Person",
  NO_DOCUMENTO: "No. Document",
  DIRECCION: "Address",
  TELEFONO: "Phone",
  CUENTA_BANCARIA: "Bank Account",
  SUCURSAL: "Branch Office",
  TIPO_CUENTA: "Account Type",

  //REGISTRO PRESUPUESTAL
  NO_CRP: "No. CRP",
  RESPONSABLE: "Responsible",
  VALOR_CRP: "Value CRP",
  NO_CDP: "NO. CDP",
  COMPROMISO: "Commitment",
  DESCRIPCION_COMPROMISO: "Description Commitment",

  //PLAN DE CUENTAS
  PLANES_CUENTAS: "Planes de Cuentas",
  NUEVO_PLAN_CUENTAS: "Crear Nuevo Plan de cuentas",
  INGRESE_NOMBRE_PLAN_CUENTAS: "Ingresa el nombre del plan de cuentas",
  DESCRIPCION_PLAN: " Descripción del nuevo plan...",
  PLAN_CUENTAS_MAESTRO: "Plan de Cuentas Maestro",
  NUEVA_CUENTA: "Nueva Cuenta",

  //DIRECTIVE/CUENTAS_CONTABLES/PLANES_CUENTAS
  D_PLANES_CUENTA: {
    LISTADO_PLAN_CUENTAS: "Listado de Planes de Cuentas",
    NO_FILAS: "Número de Filas"
  },
  BTN: {
    VER: "Ver",
    SELECCIONAR: "Seleccionar",
    CANCELAR: "Cancelar",
    CONFIRMAR: "Confirmar",
    AGREGAR: "Agregar",
    REGISTRAR: "Registrar",
    SOLICITAR_RP:"Solicitar RP",
    QUITAR_RUBRO: "Quitar",
  },
  // Ordenes de Pago
};

angular.module('financieraClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
