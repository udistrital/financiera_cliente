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
  VALOR: "Valor",
  FUENTES_FINANCIACION: "Fuentes Financiación",
  FUENTE_FINANCIACION_CODIGO: "Código Fuente",
  CONCEPTOS: "Conceptos",
  CONCEPTO: "Concepto",
  TIPO: "Tipo",
  AFECTACION: "Afectación",
  CUENTAS_CONTABLES: "Cuentas Contables",
  DEBITO: "Débito",
  CREDITO: "Crédito",
  CUENTA: "Cuenta",
  ACTUALIZAR: "Actualizar",


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
  NO_CDP: "No. CDP",
  COMPROMISO: "Compromiso",
  DESCRIPCION_COMPROMISO: "Descripción Compromiso",

  //PLAN DE CUENTAS
  PLANES_CUENTAS: "Planes de Cuentas",
  NUEVO_PLAN_CUENTAS: "Crear Nuevo Plan de cuentas",
  INGRESE_NOMBRE_PLAN_CUENTAS: "Ingresa el nombre del plan de cuentas",
  DESCRIPCION_PLAN: " Descripción del nuevo plan...",
  PLAN_CUENTAS_MAESTRO: "Plan de Cuentas Maestro",
  NUEVA_CUENTA: "Nueva Cuenta",

  //MOVIMIENTOS CUENTAS_CONTABLES
  PRINCIPIO_PARTIDA_DOBLE_CUMPLE: "¡El principio de la partida Doble o dualidad se cumple!",
  PRINCIPIO_PARTIDA_DOBLE_ADVERTENCIA: "¡Recuerda que la suma de los montos debitados y de los montos acreditados debe ser la misma e igual al valor dado sobre el concepto!",


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
    SOLICITAR_RP: "Solicitar RP",
    QUITAR_RUBRO: "Quitar",
    APROBAR: "Aprobar"
  },
  // ORDEN DE PAGO
  ORDEN_PAGO: "Ordenes de Pago",
  ORDEN_PAGO_SELECCIOANR: "Seleccionar Orden de Pago",
  ORDEN_PAGO_ACTUALIZAR: "Actualizar Ordenes de Pago",
  DETALLE_ORDEN_PAGO: 'Detalle Orden de Pago',
  VALOR_PAGO: "Valor Pago",
  DETALLE_VALOR_PAGO: "Detalle Valor Pago",
  DETALLE_OP: "Detalle Orden de Pago",
  VALOR_BASE_RETENCION: "Valor Base Retención",
  POR_IVA: "% IVA",
  VAL_IVA: "Valor IVA",
  VALOR_BRUTO: "Valor Bruto",

  //CONCEPTOS
  AFECTACION_CONCEPTO: "Ingresar Afectación por Conceptos",
  OPERAR_CONCEPTO: "Operar Concepto",

  //Rubro
  RUBRO: "Rubro",
  REGISTRO_RUBRO: "Registro de Rubro",
  CONSULTA_RUBRO: "Consulta de Rubros",
  CONSULTA_APROBACION_INICIAL: "Consulta de Apropiación Inicial",
  APROBACION_PRESUPUESTO: "Aprobación de Presupuesto",
  SELECCIONAR_RUBRO: "Seleccionar Rubro",


  //FUENTES DE FINANCIAMIENTO
  TITULO_FUENTES_CREAR: "Crear Fuentes de Financiamiento",
  TITULO_FUENTES_CONSULTAR: "Consultar Fuentes de Financiamiento",
  TITULO_FUENTES_DETALLE: "Detalle Fuentes de Financiamiento",

  //CDP
  TITULO_SOLICITUD_CDP: "Solicitudes de Certificado de Disponibilidad Presupuestal",
  SOLICITUD_CDP: "Solicitud de CDP No.",
  DEPENDENCIA_SOLICITANTE: "Dependencia Solicitante",
  JEFE_DEPENDENCIA: 'Jefe de la Dependencia',
  DEPENDENCIA_DESTINO: 'Dependencia Destino',
  ORDENADOR_GASTO: 'Ordenador del Gasto',
  OBJETO_CONTRACTUAL: 'Objeto Contractual ',
  VALOR_CONTRATACION: 'Valor De La Contratación',
  JUSTIFICACION: 'Justificación',
  AFECTACION_PRESUPUESTAL: "Afectación Presupuestal",
  LISTA_CDP: "Lista De Certificados De Disponibilidad Presupuestal",
  DATOS_NECESIDAD: "Datos de la Necesidad",
  NECESIDAD_NO:"Necesidad No. ",
  RESPONSABLE_SELECCION_PRESUPUESTO:"Responsable Sección De Presupuesto",
  OBJETO:"Objeto",
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
  NATURALEZA: "Nature",
  SALDO: "Balance",
  DISPONIBLE: "Disponible",
  VIGENCIA: "Validity",
  FECHA_CREACION: "Creation Date",
  TIPO_DOCUMENTO: "Document Type",
  ESTADO: "State",
  OPERACION: "Operation",
  ENTIDAD: "Entity",
  UNIDAD_EJECUTORA: "Executing Unit",
  SELECCION_UNIDAD_EJECUTORA: "Select Executing Unit",
  DETALLE_UNIDAD_EJECUTORA: "Detail Executing Unit",
  PROVEEDOR: "Provider",
  SELECCIONE_PROVEEDOR: "Select Provider",
  DETALLE_PROVEEDOR: "Detail Provider",
  REGISTRO_PRESUPUESTAL: "Certificate Registry Budget",
  SELECCIONE_CRP: "Select CRP",
  DETALLE_CRP: "Detail CRP",
  VALOR: "Value",
  FUENTES_FINANCIACION: "Sources of funding",
  FUENTE_FINANCIACION_CODIGO: "Code Sources of funding",
  CONCEPTOS: "Concepts",
  CONCEPTO: "Concept",
  TIPO: "Type",
  AFECTACION: "Affectation",
  CUENTAS_CONTABLES: "Accounting Accounts",
  DEBITO: "Debit",
  CREDITO: "Credit",
  CUENTA: "Account",
  ACTUALIZAR: "Update",

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
  NO_CDP: "No. CDP",
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
    SOLICITAR_RP: "Solicitar RP",
    QUITAR_RUBRO: "Quitar",
    APROBAR: "Aprobar"
  },

  // ORDEN DE PAGO
  ORDEN_PAGO: "Payment Orders",
  ORDEN_PAGO_SELECCIOANR: "Select Payment Order",
  ORDEN_PAGO_ACTUALIZAR: "Update Payment Orders",
  DETALLE_ORDEN_PAGO: 'Detail Payment Orders',
  DETALLE_OP: "Detail Payment Orders",
  VALOR_PAGO: "Amount Paid",
  DETALLE_VALOR_PAGO: "Detail Value Paid",
  VALOR_BASE_RETENCION: "Base Value Withholding",
  POR_IVA: "% IVA",
  VAL_IVA: "Value IVA",
  VALOR_BRUTO: "Gross Value",

  //CONCEPTOS
  AFECTACION_CONCEPTO: "Enter Affection for Concept",
  OPERAR_CONCEPTO: "Operate Concept",

  //Rubro
  RUBRO: "Rubro",
  REGISTRO_RUBRO: "Registro de Rubro",
  CONSULTA_RUBRO: "Consulta de Rubros",
  CONSULTA_APROBACION_INICIAL: "Consulta de Apropiación Inicial",
  APROBACION_PRESUPUESTO: "Aprobación de Presupuesto",
  SELECCIONAR_RUBRO: "Select Item",
};

angular.module('financieraClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
  });
