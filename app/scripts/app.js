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
        'afOAuth2',
        'treeControl',
        'ngMaterial',
        //'material.svgAssetsCache',
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
        'ui.grid.exporter',
        'ngStorage',
        'ngWebSocket',
        'angularMoment',
        'ui.utils.masks',
        'pascalprecht.translate',
        'ui.grid.expandable',
        'ui.grid.pinning',
        'ui.select',
        'ui.knob',
        //'kendo.directives',
        // Servicios
        'academicaService',
        'financieraService',
        'financieraMidService',
        'administrativaService',
        'administrativaPruebasService',
        'agoraService',
        'adminMidService',
        'argoService',
        'coreService',
        'oikosService',
        'titanService',
        'pagosService',
        'financieraNotificacion',
        'arkaService',
        'configuracionService',
        "wso2Service",
        "requestService"
    ])

.run(function(amMoment) {
        amMoment.changeLocale('es');
    })
    .config(['cfpLoadingBarProvider', 'uiSelectConfig', function(cfpLoadingBarProvider, uiSelectConfig) {
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        uiSelectConfig.theme = 'select2';
        uiSelectConfig.resetSearchInput = true;
        uiSelectConfig.appendToBody = true;
    }])
    .config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment.utc(date).format('YYYY-MM-DD') : '';
        };
    })
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
                controller: 'crearCompromisoCtrl',
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
                templateUrl: 'views/orden_pago/proveedor/op_crear.html',
                controller: 'OrdenPagoOpCrearCtrl',
                controllerAs: 'opCrear'
            })
            .when('/orden_pago/ver_todos', {
                templateUrl: 'views/orden_pago/op_view_all.html',
                controller: 'OrdenPagoOpViewAllCtrl',
                controllerAs: 'opViewAll'
            })
            .when('/orden_pago/proveedor/ver/:Id', {
                templateUrl: 'views/orden_pago/proveedor/op_proveedor_ver_por_id.html',
                controller: 'OpProveedorVerPorIdCtrl',
                controllerAs: 'opProveedorVerPorId'
            })
            .when('/orden_pago/proveedor/actualizar/:Id', {
                templateUrl: 'views/orden_pago/proveedor/op_proveedor_update_por_id.html',
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
            .when('/orden_pago/seguridad_social/crear', {
                templateUrl: 'views/orden_pago/seguridad_social/op_seguridad_social_crear.html',
                controller: 'OpSeguridadSocialCrearCtrl',
                controllerAs: 'opSeguridadSocialCrear'
            })
            .when('/orden_pago/seguridad_social/ver/:Id', {
                templateUrl: 'views/orden_pago/seguridad_social/op_seguridad_social_ver_por_id.html',
                controller: 'OpSeguridadSocialVerPorIdCtrl',
                controllerAs: 'opSeguridadSocialVerPorId'
            })
            .when('/orden_pago/hora_categra/crear', {
                templateUrl: 'views/orden_pago/hora_categra/op_hc_crear.html',
                controller: 'OrdenPagoHoraCategraOpHcCrearCtrl',
                controllerAs: 'opHcCrear'
            })
            .when('/orden_pago/giros/ver_todos', {
                templateUrl: 'views/orden_pago/giros/giros_view_all.html',
                controller: 'OpGirosViewAllCtrl',
                controllerAs: 'opGirosViewAll'
            })
            .when('/orden_pago/giros/giros_crear', {
              templateUrl: 'views/orden_pago/giros/giros_crear.html',
              controller: 'GirosCrearCtrl',
              controllerAs: 'girosCrear'
            })
            .when('/orden_pago/giros/ver/:Id', {
              templateUrl: 'views/orden_pago/giros/giros_ver_por_id.html',
              controller: 'GirosVerPorIdCtrl',
              controllerAs: 'girosVerPorId'
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
            .when('/fuente_financiacion/modificacion_fuente', {
                templateUrl: 'views/fuente_financiacion/modificacion_fuente.html',
                controller: 'modificacionFuenteCtrl',
                controllerAs: 'modificacionFuente'
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
            .when('/pac/reporte_pac', {
                templateUrl: 'views/pac/reporte_pac.html',
                controller: 'PacReportePacCtrl',
                controllerAs: 'reportePac'
            })
            .when('/calendario_tributario/gestion_calendario', {
                templateUrl: 'views/calendario_tributario/gestion_calendario.html',
                controller: 'GestionCalendarioCtrl',
                controllerAs: 'gestionCalendario'
            })
            .when('/calendario_tributario/admin_calendario/:Id', {
                templateUrl: 'views/calendario_tributario/admin_calendario.html',
                controller: 'AdminCalendarioCtrl',
                controllerAs: 'adminCalendario'
            })
            .when('/tesoreria/avances/lista_solicitud', {
                templateUrl: 'views/tesoreria/avances/solicitud/lista_solicitud.html',
                controller: 'ListaSolicitudCtrl',
                controllerAs: 'listaSolicitud'
            })
            .when('/cdp/cdp_aprobacion_anulacion', {
                templateUrl: 'views/cdp/cdp_aprobacion_anulacion.html',
                controller: 'CdpCdpAprobacionAnulacionCtrl',
                controllerAs: 'cdpAprobacionAnulacion'
            })
            .when('/rp/rp_aprobacion_anulacion', {
                templateUrl: 'views/rp/rp_aprobacion_anulacion.html',
                controller: 'RpRpAprobacionAnulacionCtrl',
                controllerAs: 'rpAprobacionAnulacion'
            })            .when('/orden_pago/giros/giros_ver_por_id', {
              templateUrl: 'views/orden_pago/giros/giros_ver_por_id.html',
              controller: 'OrdenPagoGirosGirosVerPorIdCtrl',
              controllerAs: 'ordenPago/giros/girosVerPorId'
            })
            .when('/compromisos/listado_compromisos', {
                templateUrl: 'views/compromisos/listado_compromisos.html',
                controller: 'GestionCompromisosCtrl',
                controllerAs: 'gestionCompromisos'
            })
            .when('/conceptos/listado_conceptos', {
                templateUrl: 'views/conceptos/listado_conceptos.html',
                controller: 'ListadoConceptosCtrl',
                controllerAs: 'listadoConceptos'
            })
            .when('/conceptos/editar/:Codigo', {
                templateUrl: 'views/conceptos/editar.html',
                controller: 'conceptosEditarCtrl',
                controllerAs: 'conceptosEditar'
            })
            .when('/plan_cuentas/editar_descuento/:Id', {
                templateUrl: 'views/plan_cuentas/editar_descuento.html',
                controller: 'EditarDescuentoCtrl',
                controllerAs: 'editarDescuento'
            })
            .when('/rp/rp_cargue_masivo', {
                templateUrl: 'views/rp/rp_cargue_masivo.html',
                controller: 'RpRpCargueMasivoCtrl',
                controllerAs: 'rpCargueMasivo'
            })
            .when('/plan_cuentas/editar_cuenta/:Id', {
                templateUrl: 'views/plan_cuentas/editar_cuenta.html',
                controller: 'EditarCuentaCtrl',
                controllerAs: 'editarCuenta'
            })
            .when('/homologacion_concepto/homologacion_concepto_ver_todas', {
              templateUrl: 'views/homologacion_concepto/homologacion_concepto_ver_todas.html',
              controller: 'HomologacionConceptoVerTodasCtrl',
              controllerAs: 'homologacionConceptoVerTodas'
            })
            .when('/homologacion_concepto/homologacion_concepto_crear', {
              templateUrl: 'views/homologacion_concepto/homologacion_concepto_crear.html',
              controller: 'HomologacionConceptoCrearCtrl',
              controllerAs: 'homologacionConceptoCrear'
            })
            .when('/homologacion_concepto/ver/:Id', {
              templateUrl: 'views/homologacion_concepto/homologacion_concepto_ver_por_id.html',
              controller: 'HomologacionConceptoVerPorIdCtrl',
              controllerAs: 'homologacionConceptoVerPorId'
            })
            .when('/homologacion_concepto/actualizar/:Id', {
              templateUrl: 'views/homologacion_concepto/homologacion_concepto_actualizar.html',
              controller: 'HomologacionConceptoActualizarCtrl',
              controllerAs: 'homologacionConceptoActualizar'
            })
            .when('/tesoreria/avances/legalizacion', {
                templateUrl: 'views/tesoreria/avances/solicitud/legalizacion.html',
                controller: 'LegalizacionCtrl',
                controllerAs: 'legalizacion'
            })
            .when('/rubro/modificacion_solicitud_registro', {
              templateUrl: 'views/rubro/modificacion_solicitud_registro.html',
              controller: 'RubroModificacionSolicitudRegistroCtrl',
              controllerAs: 'rubroModificacionSolicitudRegistro'
            })
            .when('/rubro/modificacion_solicitud_consulta', {
              templateUrl: 'views/rubro/modificacion_solicitud_consulta.html',
              controller: 'RubroModificacionSolicitudConsultaCtrl',
              controllerAs: 'modificacionSolicitudConsulta'
            })
            .when('/reportes/reportes', {
              templateUrl: 'views/reportes/reportes.html',
              controller: 'ReportesReportesCtrl',
              controllerAs: 'reportes'
            })
            .when('/reportes/presupuesto/listado_apropiaciones', {
              templateUrl: 'views/reportes/presupuesto/listado_apropiaciones.html',
              controller: 'ReporteListadoApropiacionesCtrl',
              controllerAs: 'listadoApropiaciones'
            })
            .when('/reportes/presupuesto/c_d_p', {
              templateUrl: 'views/reportes/presupuesto/c_d_p.html',
              controller: 'ReportesPresupuestoCDPCtrl',
              controllerAs: 'cDP'
            })
            .when('/reportes/presupuesto/r_p', {
              templateUrl: 'views/reportes/presupuesto/r_p.html',
              controller: 'ReportesPresupuestoRPCtrl',
              controllerAs: 'rP'
            })
            .when('/pac/cierre_periodo', {
              templateUrl: 'views/pac/cierre_periodo.html',
              controller: 'PacCierrePeriodoCtrl',
              controllerAs: 'cierrePeriodo'
          })
            .when('/ingresos/ingreso_registroG/:tipoIngreso', {
              templateUrl: 'views/ingresos/ingreso_registrog.html',
              controller: 'IngresosIngresoRegistrogCtrl',
              controllerAs: 'ingresoRegistroG'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
