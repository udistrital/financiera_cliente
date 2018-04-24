'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:SolicitudAvanceCtrl
 * @description
 * # SolicitudAvanceCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('SolicitudAvanceCtrl', function($scope, modelsRequest, academicaRequest, financieraRequest, $translate, $location) {
        var ctrl = this;
        $scope.info_terceros = true;
        $scope.info_desc_avances = true;
        $scope.info_detalle_avances = true;
        ctrl.tipos_avance = [];
        ctrl.lista_tipos = [];

        ctrl.get_tipos_avance = function() {
            financieraRequest.get("tipo_avance", $.param({
                    query: "Activo:1",
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.tipos_avance = response.data;
                    console.log(ctrl.tipos_avance);
                });
        };
        ctrl.get_tipos_avance();
        ctrl.ver_seleccion = function($item, $model) {
            ctrl.tercero = $item;
            ctrl.tercero.dependencia = "NO APLICA";
        }

        var parametros = "";
        academicaRequest.get(parametros)
            .then(function(response) {
                ctrl.terceros = response.data;
                console.log(ctrl.terceros);
            });

        ctrl.calcular_total = function() {
            ctrl.total = 0;
            angular.forEach(ctrl.lista_tipos, function(data) {
                console.log(data);
                ctrl.total += data.Valor;
            });
            console.log(ctrl.total);
        };

        ctrl.anadir_tipo = function() {
            if (ctrl.tipo_avance_select !== '' && ctrl.tipo_avance_select !== 'undefined' &&
                ctrl.valor_avance !== '' && ctrl.valor_avance !== 'undefined' &&
                ctrl.descripcion !== '' && ctrl.descripcion !== 'undefined') {
                var TipoAvance = {};
                for (var i = 0; i < ctrl.tipos_avance.length; i++) {
                    if (ctrl.tipos_avance[i].Id == ctrl.tipo_avance_select) {
                        TipoAvance.Descripcion = ctrl.descripcion;
                        TipoAvance.Valor = parseFloat(ctrl.valor_avance);
                        var tipo = ctrl.tipos_avance.splice(i, 1);
                        TipoAvance.TipoAvance = tipo[0];
                        TipoAvance.requisitos_seleccionados = [];
                        //recopilando requisitos
                        financieraRequest.get("requisito_tipo_avance", $.param({
                                query: "TipoAvance.Id:" + ctrl.tipo_avance_select + ",TipoAvance.Activo:1,Activo:1",
                                limit: -1,
                                fields: "RequisitoAvance,TipoAvance",
                                sortby: "TipoAvance",
                                order: "asc"
                            }))
                            .then(function(response) {
                                TipoAvance.requisitos_seleccionados.push(response.data);
                                console.log(TipoAvance.requisitos_seleccionados);
                            });

                        ctrl.lista_tipos.push(TipoAvance);

                        ctrl.descripcion = '';
                        ctrl.valor_avance = '';
                        ctrl.tipo_avance_select = '';
                    }
                }
                ctrl.calcular_total();
            }
        };

        ctrl.enviar = function() {
            var Solicitud = {};
            var SolicitudAvance = {};
            Solicitud.Beneficiario = parseInt(ctrl.tercero.documento);
            Solicitud.Objetivo = ctrl.objetivo;
            Solicitud.Justificacion = ctrl.justificacion;
            Solicitud.CodigoConvenio = ctrl.codigo_convenio;
            Solicitud.Convenio = ctrl.nombre_convenio;
            Solicitud.CodigoProyectoInv = ctrl.codigo_proyecto_inv;
            Solicitud.ProyectoInv = ctrl.nombre_proyecto_inv;
            SolicitudAvance.Solicitud = Solicitud;
            SolicitudAvance.TipoAvance = ctrl.lista_tipos;
            console.log(SolicitudAvance);

            financieraRequest.post("solicitud_avance/TrSolicitudAvance", SolicitudAvance)
                .then(function(response) {
                    console.log(response.data);
                    if (response.data.Type !== undefined) {
                        if (response.data.Type === "error") {
                            swal('', $translate.instant(response.data.Code), response.data.Type);
                        } else {
                            swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type);
                            $location.path('/tesoreria/avances/lista_solicitud');
                        }
                    }
                });
        };



    });