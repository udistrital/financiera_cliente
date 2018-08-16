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
        ctrl.total = 0;
        ctrl.tipos_avance = [];
        ctrl.lista_tipos = [];
        ctrl.hayData = false;
        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
          { clase_color: "ver", clase_css: "fa fa-trash fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.BORRAR'), operacion: 'borrar', estado: true },
        ];

        ctrl.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            paginationPageSizes: [5, 10],
            paginationPageSize: 5,
            useExternalPagination: true,

            columnDefs: [
              {
                  field: 'TipoAvance.Nombre',
                  displayName: $translate.instant('NOMBRE'),
                  cellClass: 'input_center',
                  headerCellClass: 'encabezado',
                  width: "25%",
              },
              {
                field: 'Descripcion',
                cellClass: 'input_center',
                displayName: $translate.instant('DESCRIPCION'),
                headerCellClass: 'encabezado',
                width: "25%",
            }, {
                field: 'Valor',
                cellClass: 'input_right',
                cellFilter: 'currency',
                displayName: $translate.instant('VALOR'),
                headerCellClass: 'encabezado',
                width: "25%",

            },  {
                field: 'Opciones',
                cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>',
                headerCellClass: 'encabezado',
                width: "25%",
            }]
        };



        $scope.loadrow = function(row, operacion) {
          ctrl.operacion = operacion;
          switch (operacion) {
              case "borrar":
                ctrl.borrarFila(row);
              break;

              case "ver":
                ctrl.verRequisitos(row);

              break;
              default:
          }
      };

      ctrl.verRequisitos = function(row){
        ctrl.row_seleccionada = row.entity;
        if(typeof(ctrl.row_seleccionada.requisitos_seleccionados[0]) === "string"){
          ctrl.hayRequisitos = false;

        }else{
          ctrl.hayRequisitos = true;
          ctrl.requisitos = ctrl.row_seleccionada.requisitos_seleccionados[0];
        }
         $('#modal_informacion_tipo_avance').modal('show');

      };

      ctrl.borrarFila = function(row) {
           var index = ctrl.gridOptions.data.indexOf(row.entity);
           ctrl.gridOptions.data.splice(index, 1);

           if(ctrl.gridOptions.data.length === 0){
             ctrl.hayData = false;

           }else{
             ctrl.hayData = true;
           }
           ctrl.calcular_total();
         };

        ctrl.get_tipos_avance = function() {
            financieraRequest.get("tipo_avance", $.param({
                    query: "Activo:1",
                    limit: -1,
                    sortby: "Id",
                    order: "asc"
                }))
                .then(function(response) {
                    ctrl.tipos_avance = response.data;

                });
        };
        ctrl.get_tipos_avance();
        ctrl.ver_seleccion = function($item, $model) {
            ctrl.tercero = $item;
            ctrl.tercero.dependencia = $translate.instant('NO_APLICA');
        }

        var parametros = "";
        academicaRequest.get(parametros)
            .then(function(response) {
                ctrl.terceros = response.data;

            });

        ctrl.calcular_total = function() {
            ctrl.total = 0;
            angular.forEach(ctrl.lista_tipos, function(data) {

                ctrl.total += data.Valor;
            });

        };

        ctrl.camposObligatorios = function() {
          var respuesta;
          ctrl.MensajesAlerta = '';


          if (ctrl.tercero === undefined) {
              ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TERCERO') + "</li>";

          }

          if($scope.datosOblig.$invalid){
            angular.forEach($scope.datosOblig.$error,function(controles,error){
              angular.forEach(controles,function(control){
                control.$setDirty();
              });
            });

          

            ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant('CAMPOS_OBLIGATORIOS') + "</li>";
          }

          if (ctrl.lista_tipos.length === 0) {
                ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant('MSN_TIPO_AVANCE') + "</li>";

            }

          // Operar
          if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
            respuesta = true;
          } else {
            respuesta =  false;
          }

          return respuesta;
        };


        ctrl.camposObligatoriosTipoAvance = function() {
          var respuesta;
          ctrl.MensajesAlerta = '';

          if($scope.datosTipoAvance.$invalid){
            angular.forEach($scope.datosOblig.$error,function(controles,error){
              angular.forEach(controles,function(control){
                control.$setDirty();
              });
            });

            ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant('CAMPOS_OBLIGATORIOS_AVANCE') + "</li>";
          }

          // Operar
          if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
            respuesta = true;
          } else {
            respuesta =  false;
          }

          return respuesta;
        };


        ctrl.anadir_tipo = function() {

            if (ctrl.camposObligatoriosTipoAvance()) {
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

                            });

                        ctrl.lista_tipos.push(TipoAvance);

                        ctrl.descripcion = '';
                        ctrl.valor_avance = '';
                        ctrl.tipo_avance_select = '';
                    }
                }
                ctrl.calcular_total();
                ctrl.gridOptions.data = ctrl.lista_tipos;
                if(ctrl.gridOptions.data === null){
                  ctrl.hayData = false;
                }else{
                  ctrl.hayData = true;
                }

            }else {
              // mesnajes de error campos obligatorios
              swal({
                title: 'Error!',
                html: '<ol align="left">' + ctrl.MensajesAlerta + '</ol>',
                type: 'error'
              })
            }
        };

        ctrl.enviar = function() {


            if(ctrl.camposObligatorios()){
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
        } else {
          // mesnajes de error campos obligatorios
          swal({
            title: '¡Error!',
            html: '<ol align="left">' + ctrl.MensajesAlerta + '</ol>',
            type: 'error'
          })
        }
      };


    });
