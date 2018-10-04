'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl
 * @description
 * # TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('legalizacionEvtCompraCtrl', function ($scope,financieraRequest,$translate,$interval,administrativaRequest,$localStorage,$location,financieraMidRequest,agoraRequest) {
    var ctrl = this;
    ctrl.LegalizacionCompras = { Valor: 0 };
    ctrl.Impuesto = [];
    ctrl.concepto = [];
    ctrl.LegalizacionCompras.FechaCompra = new Date();
    $scope.solicitud = $localStorage.avance;
    ctrl.Total = 0;
    ctrl.subtotal = 0;
    ctrl.gridImpuestos = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableFiltering: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        useExternalPagination: false,
        enableSelectAll: false,
        columnDefs: [{
                field: 'Id',
                displayName: $translate.instant('ID'),
                headerCellClass: 'encabezado',
                cellClass: 'input_center',
                width: '12.5%'
            },
            {
                field: 'Descripcion',
                displayName: $translate.instant('DESCRIPCION'),
                width: '12.5%',
                headerCellClass: 'encabezado',
                cellClass: 'input_center',
            },
            {
                field: 'TarifaUvt',
                displayName: $translate.instant('UVT'),
                width: '12.5%',
                headerCellClass: 'encabezado',
                cellClass: 'input_center',
            },
            {
                field: 'Porcentaje',
                displayName: $translate.instant('PORCENTAJE'),
                width: '12.5%',
                headerCellClass: 'encabezado',
                cellClass: 'input_center',
            },
            {
                field: 'Deducible',
                displayName: $translate.instant('DEDUCIBLE'),
                cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.Deducible" disabled></center>',
                width: '12.5%',
                headerCellClass: 'encabezado',
                cellClass: 'input_center',
            },
            {
                field: 'CuentaContable.Codigo',
                displayName: $translate.instant('CODIGO_CUENTA'),
                width: '12.5%',
                headerCellClass: 'encabezado',
                cellClass: 'input_center',
            },
            {
                field: 'TipoCuentaEspecial.Nombre',
                displayName: $translate.instant('TIPO'),
                width: '12.5%',
                headerCellClass: 'encabezado',
                cellClass: 'input_center',
            }
        ]
    };
    ctrl.gridImpuestos.onRegisterApi = function (gridApi) {
                ctrl.gridImpuestosApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope,function(row){
                if(row.isSelected) {
                  row.entity.Valor = row.entity.Porcentaje * ctrl.LegalizacionCompras.Valor
                 ctrl.Impuesto.push(row.entity);
               }else{
                 ctrl.Impuesto.splice(ctrl.Impuesto.indexOf(row.entity), 1);
               }
               ctrl.calcular_valor_impuesto ();
                });
            }
    ctrl.cargar_impuestos = function() {
        financieraRequest.get("cuenta_especial",
                $.param({
                    limit: -1,
                    query: "TipoCuentaEspecial.Id__in:2|3|4|5"

                }))
            .then(function(response) {
                ctrl.gridImpuestos.data = response.data;
              });
            }
    ctrl.cargar_impuestos();
    ctrl.calcular_valor_impuesto = function() {
        var sum_impuestos = 0;
        ctrl.Total = 0;
        ctrl.subtotal = 0;
        for (var i in ctrl.Impuesto) {
            if (ctrl.Impuesto[i].Id === 56) {
                if (!angular.isUndefined(ctrl.Impuesto.IVA)) {
                    ctrl.Impuesto[i].Valor = ctrl.Impuesto[i].Porcentaje * ctrl.Impuesto.IVA.Porcentaje * ctrl.LegalizacionCompras.Valor;
                } else {
                    ctrl.Impuesto[i].Valor = 0;
                }
            } else {
                ctrl.Impuesto[i].Valor = ctrl.Impuesto[i].Porcentaje * ctrl.LegalizacionCompras.Valor;
            }
            if (!angular.isUndefined(ctrl.Impuesto[i].Valor) && ctrl.Impuesto[i].TipoCuentaEspecial.Id !== 3) {
                sum_impuestos += ctrl.Impuesto[i].Valor;
            }
        }
        ctrl.IVA = ctrl.Impuesto.find(function(item){
          return(item.TipoCuentaEspecial.Id===3);
        });
        if (angular.isUndefined(ctrl.IVA)) {
            ctrl.subtotal = ctrl.LegalizacionCompras.Valor;
        } else {
            ctrl.subtotal = ctrl.LegalizacionCompras.Valor + (ctrl.IVA.Porcentaje * ctrl.LegalizacionCompras.Valor);
        }
        ctrl.Total = ctrl.subtotal - sum_impuestos;
    };
    ctrl.limpiar_compras = function() {
        $scope.encontrado = false;
        ctrl.LegalizacionCompras = null;
    };
    $scope.$watch('d', function() {
        if($scope.d){
          $interval( function() {
              ctrl.gridImpuestosApi.core.handleWindowResize();
            }, 500, 2);


        }
      });

      ctrl.consultarListas = function(){
        agoraRequest.get('parametro_estandar',$.param({
          query:"ClaseParametro:Tipo Documento",
          limit:-1
        })).then(function(response){
          ctrl.LegalizacionCompras.tiposdoc = response.data;
        });
      }
    ctrl.consultarListas();
    ctrl.cargar_proveedor = function() {
        $scope.encontrado = false;
        ctrl.LegalizacionCompras.InformacionProveedor = null;
        if (angular.isUndefined(ctrl.LegalizacionCompras.tipoDocTercero)) {
          swal('',$translate.instant("SELECCIONAR_TIPO_DOCUMENTO"),'error');
          return;
        }
        financieraMidRequest.get("administrativa_personas/GetPersona",$.param({
          numberId:ctrl.LegalizacionCompras.Tercero,
          typeId:ctrl.LegalizacionCompras.tipoDocTercero.Id,
        })).then(function(response){
          if (response.data == null) {
              $scope.encontrado = true;
          } else {
              ctrl.InformacionProveedor = response.data;
          }
        });
/*        administrativaRequest.get("informacion_proveedor",
                $.param({
                    query: "NumDocumento:" + ctrl.LegalizacionCompras.Tercero,
                    limit: -1
                }))
            .then(function(response) {

            });*/
    }
    $scope.$watch('legalizacionEvtCompra.concepto[0].Id', function(newValue,oldValue) {
                if (!angular.isUndefined(newValue)) {
                    financieraRequest.get('concepto', $.param({
                        query: "Id:" + newValue,
                        fields: "Rubro",
                        limit: -1
                    })).then(function(response) {
                        ctrl.concepto[0].Rubro = response.data[0].Rubro;
                    });
                }
            }, true);

    ctrl.camposObligatorios = function() {
      var respuesta;
      ctrl.MensajesAlerta = '';

      if($scope.compras.$invalid){
        angular.forEach($scope.compras.$error,function(controles,error){
          angular.forEach(controles,function(control){
            control.$setDirty();
          });
        });
        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("CAMPOS_OBLIGATORIOS") + "</li>";
      }

      if(ctrl.Impuesto.length === 0){
        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("SELECCIONAR_IMPUESTOS") + "</li>";
      }

      if(angular.isUndefined(ctrl.concepto[0])){
        ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("MSN_DEBE_CONCEPTO") + "</li>";
      }else{
        if (ctrl.concepto[0].validado === false) {
          ctrl.MensajesAlerta = ctrl.MensajesAlerta + "<li>" + $translate.instant("PRINCIPIO_PARTIDA_DOBLE_ADVERTENCIA") + "</li>";
        }
      }

      if (ctrl.MensajesAlerta == undefined || ctrl.MensajesAlerta.length == 0) {
        respuesta = true;
      } else {
        respuesta =  false;
      }

      return respuesta;
     }

     ctrl.guardar = function(){
       var request ={};
       var templateAlert;
       if(!ctrl.camposObligatorios()){
         swal({
           title:'¡Error!',
           html:'<ol align="left">'+ctrl.MensajesAlerta+"</ol>",
           type:'error'
         });
         return;
       }
       ctrl.LegalizacionCompras.TipoAvanceLegalizacion = { Id: 2 };
       request.Avance = { Id: $scope.solicitud.Id };
       if (!angular.isUndefined(ctrl.LegalizacionCompras.TrmFechaCompra)) {
           ctrl.LegalizacionCompras.TrmFechaCompra = parseFloat(ctrl.LegalizacionCompras.TrmFechaCompra);
       }
       request.Movimientos = []
       angular.forEach(ctrl.concepto[0].movimientos, function(data) {
         delete data.Id;
         request.Movimientos.push(data);
       });
       request.AvanceLegalizacionTipo = ctrl.LegalizacionCompras;
       request.Valor = parseFloat(ctrl.LegalizacionCompras.Valor);
       request.Concepto=ctrl.concepto[0];
       request.TipoDocAfectanteNO = 8;
       request.Usuario = 111111;
      financieraRequest.post("avance_legalizacion_tipo/AddEntireAvanceLegalizacionTipo", request)
          .then(function(info) {
              if(angular.equals(info.data.Type,"success")){
                templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('LEGALIZACION') + "</th><th>" + $translate.instant('LEGALIZACION_EVENTO_COMPRA') + "</th>"+ "</th><th>" + $translate.instant('DETALLE');
                templateAlert = templateAlert + "<tr class='success'><td>" + info.data.Body.AvanceLegalizacion.Legalizacion + "</td>" + "<td>" + info.data.Body.Id+ "</td>" + "<td>" + $translate.instant(info.data.Code) + "</td></tr>" ;
                templateAlert = templateAlert + "</table>";
                swal('',templateAlert,info.data.Type).then(function() {
                  $scope.$apply(function(){
                      $location.path('/tesoreria/avances/legalizacion');
                  });
                })
              }else{
                swal('',info.data.Code,info.data.Type);
              }

          });
     }

  });
