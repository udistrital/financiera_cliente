'use strict';

/**
 * @ngdoc overview
 * @name financieraClienteApp
 * @description
 * # financieraClienteApp
 *
 * Main module of the application.
 */
angular
  .module('financieraClienteApp', [
    // Librerias
    'angular-loading-bar',
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngTouch',
    'afOAuth2',
    'treeControl',
    'ngMaterial',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.treeView',
    'ui.grid.selection',
    'ui.grid.exporter',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'ui.grid.resizeColumns',
    'ngStorage',
    'ngStorage',
    'ngWebSocket',
    'angularMoment',
    'ui.utils.masks',
    'pascalprecht.translate',
    'ui.grid.expandable',
    'ui.grid.pinning',

    // Servicios
    'avancesService',
    'financieraService',
    'financieraMidService',
    'administrativaService',
    'agoraService',
    'uiGridService',
    'adminMidService',
    'argoService',
    'coreService',
    'oikosService',
    'titanService',
    'pagosService',
    'financieraNotificacion'
  ])

  .run(function(amMoment) {
    amMoment.changeLocale('es');
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
      cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
      cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-clock-o fa-2x faa-spin animated"></div>';
  }])
  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix("");
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/conceptos/nuevo', {
        templateUrl: 'views/conceptos/crear_concepto.html',
        controller: 'CrearConceptoCtrl',
        controllerAs: 'crearConcepto'
      })
      .when('/notificaciones', {
        templateUrl: 'views/notificaciones.html',
        controller: 'NotificacionesCtrl',
        controllerAs: 'notificaciones'
      })
      .when('/iva', {
        templateUrl: 'views/iva/iva.html',
        controller: 'IvaCtrl',
        controllerAs: 'iva'
      })
      .when('/conceptos/concepto/:Id', {
        templateUrl: 'views/conceptos/concepto.html',
        controller: 'ConceptoCtrl',
        controllerAs: 'concepto'
      })
      .when('/compromisos/nuevo', {
        templateUrl: 'views/compromisos/crear_compromiso.html',
        controller: 'CrearCompromisoCtrl',
        controllerAs: 'crearCompromiso'
      })
      .when('/plan_cuentas/cuentas/nueva', {
        templateUrl: 'views/plan_cuentas/crear_cuentas.html',
        controller: 'PlanCuentasCrearCuentasCtrl',
        controllerAs: 'crearCuentas'
      })
      .when('/plan_cuentas/nuevo', {
        templateUrl: 'views/plan_cuentas/crear_plan.html',
        controller: 'PlanCuentasCrearPlanCtrl',
        controllerAs: 'crearPlan'
      })
      .when('/plan_cuentas/cuenta/:Id', {
        templateUrl: 'views/plan_cuentas/cuenta.html',
        controller: 'CuentaCtrl',
        controllerAs: 'cuenta'
      })
      .when('/rubro/rubro_registro', {
        templateUrl: 'views/rubro/rubroregistro.html',
        controller: 'RubroRubroRegistroCtrl',
        controllerAs: 'rubroRegistro'
      })
      .when('/rubro/rubro_consulta', {
        templateUrl: 'views/rubro/rubro_consulta.html',
        controller: 'RubroRubroConsultaCtrl',
        controllerAs: 'rubroConsulta'
      })
      .when('/rubro/rubro_apropiacion_planeacion', {
        templateUrl: 'views/rubro/rubro_apropiacion_planeacion.html',
        controller: 'RubroRubroApropiacionPlaneacionCtrl',
        controllerAs: 'rubroApropiacionPlaneacion'
      })
      .when('/rubro/rubro_apropiacion_consulta', {
        templateUrl: 'views/rubro/rubro_apropiacion_consulta.html',
        controller: 'RubroRubroApropiacionConsultaCtrl',
        controllerAs: 'rubroApropiacionConsulta'
      })
      .when('/rubro/rubro_apropiacion_aprobacion', {
        templateUrl: 'views/rubro/rubro_apropiacion_aprobacion.html',
        controller: 'RubroRubroApropiacionAprobacionCtrl',
        controllerAs: 'rubroApropiacionAprobacion'
      })
      .when('/rp/rp_registro', {
        templateUrl: 'views/rp/rp_registro.html',
        controller: 'RpRpRegistroCtrl',
        controllerAs: 'rpRegistro'
      })
      .when('/rp/rp_detalle', {
        templateUrl: 'views/rp/rp_detalle.html',
        controller: 'RpRpDetalleCtrl',
        controllerAs: 'rpDetalle'
      })
      .when('/rp/rp_consulta', {
        templateUrl: 'views/rp/rp_consulta.html',
        controller: 'RpRpConsultaCtrl',
        controllerAs: 'rpConsulta'
      })
      .when('/cdp/cdp_consulta', {
        templateUrl: 'views/cdp/cdp_consulta.html',
        controller: 'CdpCdpConsultaCtrl',
        controllerAs: 'cdpConsulta'
      })
      .when('/cdp/cdp_detalle', {
        templateUrl: 'views/cdp/cdp_detalle.html',
        controller: 'CdpCdpDetalleCtrl',
        controllerAs: 'cdpDetalle'
      })
      .when('/cdp/cdp_solicitud_consulta', {
        templateUrl: 'views/cdp/cdp_solicitud_consulta.html',
        controller: 'CdpCdpSolicitudConsultaCtrl',
        controllerAs: 'cdpSolicitudConsulta'
      })
      .when('/cdp/cdp_solicitud_detalle', {
        templateUrl: 'views/cdp/cdp_solicitud_detalle.html',
        controller: 'CdpCdpSolicitudDetalleCtrl',
        controllerAs: 'cdpSolicitudDetalle'
      })
      .when('/rp_solicitud_personas', {
        templateUrl: 'views/rp/rp_solicitud_personas.html',
        controller: 'RpSolicitudPersonasCtrl',
        controllerAs: 'rpSolicitudPersonas'
      })
      .when('/rp/rp_solicitud/:contrato/:vigencia/:valor/:documento/:nombre', {
        templateUrl: 'views/rp/rp_solicitud.html',
        controller: 'RpSolicitudCtrl',
        controllerAs: 'rpSolicitud'
      })
      .when('/cdp/cdp_anulacion', {
        templateUrl: 'views/cdp/cdp_anulacion.html',
        controller: 'CdpCdpAnulacionCtrl',
        controllerAs: 'cdpAnulacion'
      })
      .when('/rp/rp_solicitud_consulta', {
        templateUrl: 'views/rp/rp_solicitud_consulta.html',
        controller: 'RpRpSolicitudConsultaCtrl',
        controllerAs: 'rpSolicitudConsulta'
      })
      .when('/fuente_financiacion/crear_fuente', {
        templateUrl: 'views/fuente_financiacion/crear_fuente.html',
        controller: 'crearFuenteCtrl',
        controllerAs: 'crearFuente'
      })
      .when('/fuente_financiacion/consulta_fuente', {
        templateUrl: 'views/fuente_financiacion/consulta_fuente.html',
        controller: 'consultaFuenteCtrl',
        controllerAs: 'consultaFuente'
      })
      .when('/fuente_financiacion/detalle_fuente', {
        templateUrl: 'views/fuente_financiacion/detalle_fuente.html',
        controller: 'detalleFuenteCtrl',
        controllerAs: 'detalleFuente'
      })

      .when('/plan_cuentas/crear_descuento', {
        templateUrl: 'views/plan_cuentas/crear_descuento.html',
        controller: 'CrearDescuentoCtrl',
        controllerAs: 'crearDescuento'
      })

      .when('/orden_pago/proveedor/crear', {
        templateUrl: 'views/orden_pago/op_crear.html',
        controller: 'OrdenPagoOpCrearCtrl',
        controllerAs: 'opCrear'
      })
      .when('/orden_pago/ver_todos', {
        templateUrl: 'views/orden_pago/op_view_all.html',
        controller: 'OrdenPagoOpViewAllCtrl',
        controllerAs: 'opViewAll'
      })
      .when('/orden_pago/proveedor/ver/:Id', {
        templateUrl: 'views/orden_pago/op_proveedor_ver_por_id.html',
        controller: 'OpProveedorVerPorIdCtrl',
        controllerAs: 'opProveedorVerPorId'
      })
      .when('/orden_pago/actualizar_todos', {
        templateUrl: 'views/orden_pago/op_listar_todas_update.html',
        controller: 'OpListarTodasUpdateCtrl',
        controllerAs: 'opListarTodasUpdate'
      })
      .when('/orden_pago/proveedor/actualizar/:Id', {
        templateUrl: 'views/orden_pago/op_proveedor_update_por_id.html',
        controller: 'OpProveedorUpdatePorIdCtrl',
        controllerAs: 'opProveedorUpdatePorId'
       })
       .when('/orden_pago/planta/crear', {
         templateUrl: 'views/orden_pago/planta/op_planta_crear.html',
         controller: 'OpPlantaCrearCtrl',
         controllerAs: 'opPlantaCrear'
       })
       .when('/orden_pago/planta/ver/:Id', {
         templateUrl: 'views/orden_pago/planta/op_planta_ver_por_id.html',
         controller: 'OpPlantaVerPorIdCtrl',
         controllerAs: 'opPlantaVerPorId'
       })
      .when('/rp/rp_anulacion', {
        templateUrl: 'views/rp/rp_anulacion.html',
        controller: 'RpRpAnulacionCtrl',
        controllerAs: 'rpAnulacion'
       })
      .when('/plan_cuentas/crear_descuento', {
        templateUrl: 'views/plan_cuentas/crear_descuento.html',
        controller: 'CrearDescuentoCtrl',
        controllerAs: 'crearDescuento'
      })
      .when('/plan_cuentas/gestion_descuentos', {
        templateUrl: 'views/plan_cuentas/gestion_descuentos.html',
        controller: 'GestionDescuentosCtrl',
        controllerAs: 'gestionDescuentos'
      })
      .when('/ingresos/ingreso_registro', {
        templateUrl: 'views/ingresos/ingreso_registro.html',
        controller: 'IngresosIngresoRegistroCtrl',
        controllerAs: 'ingresoRegistro'
    })
      .when('/tesoreria/avances/tipos_avance', {
        templateUrl: 'views/tesoreria/avances/tipos_avance/tipos_avance.html',
        controller: 'TiposAvanceCtrl',
        controllerAs: 'TiposAvance'
       })
      .when('/plan_cuentas/gestion_plan_cuentas', {
        templateUrl: 'views/plan_cuentas/gestion_plan_cuentas.html',
        controller: 'GestionPlanCuentasCtrl',
        controllerAs: 'gestionPlanCuentas'
      })

      .when('/ingresos/ingreso_consulta', {
        templateUrl: 'views/ingresos/ingreso_consulta.html',
        controller: 'IngresosIngresoConsultaCtrl',
        controllerAs: 'ingresoConsulta'
      })
      .when('/tesoreria/avances/requisitos/requisitos', {
        templateUrl: 'views/tesoreria/avances/requisitos/requisitos.html',
        controller: 'RequisitosCtrl',
        controllerAs: 'requisitos'
      })

      .when('/plan_cuentas/gestion_plan_alterno/:Id', {
        templateUrl: 'views/plan_cuentas/gestion_plan_alterno.html',
        controller: 'GestionPlanAlternoCtrl',
        controllerAs: 'gestionPlanAlterno'
      })
      .when('/bancos/gestion_bancos', {
        templateUrl: 'views/bancos/gestion_bancos.html',
        controller: 'GestionBancosCtrl',
        controllerAs: 'gestionBancos'
      })
      .when('/tesoreria/avances/solicitud_avance', {
        templateUrl: 'views/tesoreria/avances/solicitud/solicitud_avance.html',
        controller: 'SolicitudAvanceCtrl',
        controllerAs: 'solicitudAvance'
      })
      .when('/tesoreria/avances/lista_solicitud', {
        templateUrl: 'views/tesoreria/avances/solicitud/lista_solicitud.html',
        controller: 'ListaSolicitudCtrl',
        controllerAs: 'listaSolicitud'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
