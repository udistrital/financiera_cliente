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


  //PLAN DE CUENTAS
  PLANES_CUENTAS: "Planes de Cuentas",
  NUEVO_PLAN_CUENTAS: "Crear Nuevo Plan de cuentas",
  INGRESE_NOMBRE_PLAN_CUENTAS: "Ingresa el nombre del plan de cuentas",
  UNIDAD_EJECUTORA: "Unidad Ejecutora",
  SELECCION_UNIDAD_EJECUTORA: "Selecciona la Unidad Ejecutora",
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
  //DIRECTIVE/CUENTAS_CONTABLES/PLANES_CUENTAS
  DATOS_RP:"Datos del RP",
  //SOLICITUD RP
  SOLICITUD_PERSONAS_PANEL:"Contratos para solicitud del registro presupuestal",
  VIGENCIA_ACTUAL:"Vigencia actual ",
  VIGENCIA_SELECCIONADA:"Vigencia seleccionada ",
  CDP_PANEL:"Selección de CDP",
  COMPROMISO_PANEL:"Selección de compromiso",
  SOLICITUD_RP_PANEL:"Solicitud registro presupuestal",
  BENEFICIARIO:"Beneficiario",
  NOMBRE_CONTRATISTA: "Nombre",
  DOCUMENTO_CONTRATISTA: "Documento",
  CONTRATO: "Contrato",
  NUMERO_CONTRATO: "Numero",
  VIGENCIA_CONTRATO: "Vigencia",
  VALOR_CONTRATO: "Valor contrato",
  CONSECUTIVO_ID: "Consecutivo id",
  CONSECUTIVO_OBJETO:"Objeto",
  CONSECUTIVO_ORDENADOR:"Ordenador",
  COMPROMISO: "Compromiso",
  COMPROMISO_ID:"Id",
  COMPROMISO_VIGENCIA:"Vigencia",
  COMPROMISO_TIPO:"Tipo",
  VALOR_RP:"Valor registro presupuestal",
  SALDO_RP:"Saldo registro presupuestal",
  CDP:"CDP",
  CDP_CONSECUTIVO:"Consecutivo",
  CDP_OBJETIVO:"Objetivo",
  CDP_ORDENADOR:"Ordenador",
};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop"
};

angular.module('financieraClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
