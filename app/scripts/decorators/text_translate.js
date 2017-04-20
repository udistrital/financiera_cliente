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
  REGISTRO_PRESUPUESTAL: "CRP",
  TIPO_DOCUMENTO: "Tipo Documento",
  ESTADO: "Estado",
  OPERACION: "Operación",
  UNIDAD_EJECUTORA: "Unidad Ejecutora",
  SELECCION_UNIDAD_EJECUTORA: "Seleccionar Unidad Ejecutora",
  DETALLE_UNIDAD_EJECUTORA: "Detalle Unidad Ejecutora",
  ENTIDAD:"Entidad",

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
  REGISTRO_PRESUPUESTAL: "CRP",
  TIPO_DOCUMENTO: "Document Type",
  ESTADO: "State",
  OPERACION: "Operation",
  UNIDAD_EJECUTORA: "Executing Unit",
  SELECCION_UNIDAD_EJECUTORA: "Select Executing Unit",
  DETALLE_UNIDAD_EJECUTORA: "Detail Executing Unit",
  ENTIDAD:"Entity",

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
