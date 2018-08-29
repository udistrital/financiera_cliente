'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOpViewAllCtrl
 * @description
 * # OrdenPagoOpViewAllCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoOpViewAllCtrl', function($scope, financieraRequest, $localStorage, agoraRequest, $location, $translate, uiGridConstants, $window) {

    var ctrl = this;
    ctrl.cargando = true;
    ctrl.hayData = true;

    $scope.mostrar_direc = false;
    $scope.estados = [];
    $scope.tipos = [];
    $scope.mostrar_leyenda_rp = false;
    ctrl.panelRp = true;
    $scope.estado_select = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.senDataEstado = {};
    ctrl.modal_a_abrir;
    $scope.senDataEstado.Usuario = {
      'Id': 1
    }
    $scope.botones_estados_op = [
      { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
      { clase_color: "ver", clase_css: "fa fa-product-hunt fa-lg  faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
    ];

    $scope.botones_estados_giro = [
         { clase_color: "editar", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
         { clase_color: "ver", clase_css: "fa fa-glide faa-shake animated-hover", titulo: $translate.instant('GIRO'), operacion: 'giro', estado: true },
];
    //
    ctrl.gridOrdenesDePago = {
      enableRowSelection: false,
      enableSelectAll: false,
      selectionRowHeaderWidth: 35,
      multiSelect: false,
      enableRowHeaderSelection: false,
      paginationPageSizes: [10, 50, 100],
      paginationPageSize: null,

      enableFiltering: true,
      minRowsToShow: 10,
      useExternalPagination: false,

      onRegisterApi: function(gridApi) {
        ctrl.gridApi = gridApi;

      }
    };

    $scope.loadrow = function(row, operacion) {
      ctrl.operacion = operacion;
      switch (operacion) {
          case "ver":
            ctrl.op_detalle(row);
          break;

          case "editar":
            ctrl.op_editar(row);
          break;

          case "proceso":
            $scope.estados = [];
            $scope.estado = row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago;
            ctrl.op_seleccionada_proceso = row.entity;
            $scope.informacion = $translate.instant('ORDEN_DE_PAGO')+ ' '+ 'No'+' '+row.entity.Consecutivo;
            $scope.mostrar_direc = true;
            $scope.mostrar_direc_giros = false;
            angular.forEach(ctrl.temp_estados_op, function(estado) {
              $scope.estados.push({
                id: estado.Id,
                label: estado.Nombre
              });
              $scope.estado_select.push({
                value: estado.Nombre,
                label: estado.Nombre,
                estado: estado
              });
            });

            $scope.aristas = [{
                from: 1,
                to: 2
              },
              {
                from: 2,
                to: 4
              },
              {
                from: 4,
                to: 6
              },
              {
                from: 6,
                to: 7
              }
            ];

          break;

          case "giro":

            $scope.estados = [];
            $scope.estado = row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago;
            ctrl.op_seleccionada_proceso = row.entity;
            $scope.informacion = $translate.instant('ORDEN_DE_PAGO')+ ' '+ 'No'+' '+row.entity.Consecutivo;
            $scope.mostrar_direc = true;
            angular.forEach(ctrl.temp_estados_giro, function(estado) {
                      $scope.estados.push({
                        id: estado.Id,
                        label: estado.Nombre
                      });
                      $scope.estado_select.push({
                        value: estado.Nombre,
                        label: estado.Nombre,
                        estado: estado
                      });
                    });

                    $scope.aristas = [{
                        from: 8,
                        to: 9
                      },
                      {
                        from: 9,
                        to: 10
                      }
                    ];

          break;

          default:
      }
  };


    ctrl.aprobar = function(){
       financieraRequest.post("orden_pago_estado_orden_pago/WorkFlowOrdenPago", $scope.senDataEstado)
          .then(function(data) {

            $scope.resultado = data;
            swal({
              title: $translate.instant('ORDEN_DE_PAGO'),
              text: $translate.instant($scope.resultado.data.Code),
              type: $scope.resultado.data.Type,
            }).then(function() {
              $window.location.reload();
              //$window.location.href = '#/orden_pago/ver_todos';
            })
          })
    };

    ctrl.desaprobar = function(){
      swal({
              title: '¡Rechazado!',
              text: "No se ha realizado la aprobación del estado",
              type: 'error',
            }).then(function() {
               $(ctrl.modal_a_abrir).modal('hide')
              //$window.location.href = '#/orden_pago/ver_todos';
            })

    };

    $scope.funcion = function() {

      $scope.estadoclick = $localStorage.nodeclick;
      var data = [];
      data[0] = ctrl.op_seleccionada_proceso;

        $scope.senDataEstado.OrdenPago = data;
        $scope.senDataEstado.NuevoEstado = $localStorage.nodeclick;

        if($scope.estadoclick.Id === 2){
          ctrl.modal_a_abrir = '#modal_aprobacion_contable'
            $(ctrl.modal_a_abrir).modal('show');


        }else{
          if($scope.estadoclick.Id === 4){
             ctrl.modal_a_abrir = '#modal_aprobacion_presupuestal'
             $(ctrl.modal_a_abrir).modal('show');
          }else{
            ctrl.aprobar();
          }
        }



    };

    $scope.$watch('estado_select', function() {
      ctrl.gridOrdenesDePago.columnDefs = [{
          field: 'Id',
          visible: false
        },
        {
          field: 'Consecutivo',
          displayName: $translate.instant('CODIGO'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'SubTipoOrdenPago.TipoOrdenPago.CodigoAbreviacion',
          width: '8%',
          displayName: $translate.instant('TIPO'),
          filter: {
            //term: 'OP-PROV',
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.tipos
          },
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '7%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].FechaRegistro',
          displayName: $translate.instant('FECHA_CREACION'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          cellFilter: "date:'yyyy-MM-dd'",
          width: '8%',
        },
        {
          field: 'FormaPago.CodigoAbreviacion',
          width: '5%',
          displayName: $translate.instant('FORMA_PAGO'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Proveedor.Tipopersona',
          width: '10%',
          displayName: $translate.instant('TIPO_PERSONA'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Proveedor.NomProveedor',
          displayName: $translate.instant('NOMBRE'),
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          field: 'Proveedor.NumDocumento',
          width: '10%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          displayName: $translate.instant('NO_DOCUMENTO')
        },
        {
          field: 'ValorBase',
          width: '10%',
          cellFilter: 'currency',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
          displayName: $translate.instant('VALOR')
        },
        {
          field: 'OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre',
          width: '10%',
          displayName: $translate.instant('ESTADO'),
          filter: {
            //term: 'Elaborado',
            type: uiGridConstants.filter.SELECT,
            selectOptions: $scope.estado_select

          },
          cellClass: 'input_center',
          headerCellClass: 'encabezado'
        },
        {
          //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
          name: $translate.instant('OPERACION'),
          enableFiltering: false,
          width: '9%',
          cellClass: 'input_center',
          headerCellClass: 'encabezado',
           cellTemplate: '<center><a ng-if="row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre==\'Giro-Elaborado\' || row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre==\'Giro-Aprobado\' || row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre==\'Giro-Generado\'"> <btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones_estados_giro" fila="row"></btn-registro><center></a>'+
          '<center><a ng-if="row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre!=\'Giro-Elaborado\' && row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre!=\'Giro-Aprobado\' && row.entity.OrdenPagoEstadoOrdenPago[0].EstadoOrdenPago.Nombre!=\'Giro-Generado\'"> <btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones_estados_op" fila="row"></btn-registro><center></a>'

        }
      ];
    });

    ctrl.op_detalle = function(row) {
      var path = "/orden_pago/proveedor/ver/";
      $location.url(path + row.entity.Id);
    }




    // data OP
    financieraRequest.get('orden_pago', 'limit=-1').then(function(response) {


    if(response.data === null){

      ctrl.hayData = false;
      ctrl.cargando = false;
      ctrl.gridOrdenesDePago.data = [];


    }else{

      ctrl.hayData = true;
      ctrl.cargando = false;

      ctrl.gridOrdenesDePago.data = response.data;
      // data proveedor
      angular.forEach(ctrl.gridOrdenesDePago.data, function(iterador) {

      if(iterador.RegistroPresupuestal !== undefined){
        agoraRequest.get('informacion_proveedor',
          $.param({
            query: "Id:" + iterador.RegistroPresupuestal.Beneficiario,
          })
        ).then(function(response) {
          if(response.data !== null){
            iterador.Proveedor = response.data[0];
          }

        });
      }
      });
    }
    });
    // datos tipos OP para filtros
    financieraRequest.get("tipo_orden_pago",
      $.param({
        sortby: "NumeroOrden",
        limit: -1,
        order: "asc",
      })
    ).then(function(response) {
      angular.forEach(response.data, function(tipo) {
        $scope.tipos.push({
          value: tipo.CodigoAbreviacion,
          label: tipo.CodigoAbreviacion,
        });
      });
    });
    // datos de filtros para el estado
    financieraRequest.get("estado_orden_pago", $.param({
        sortby: "NumeroOrden",
        limit: -1,
        order: "asc"
      }))
      .then(function(response) {
        ctrl.temp_estados_op = [];
        ctrl.temp_estados_giro = [];

         angular.forEach(response.data, function(iterador) {

             if(iterador.NumeroOrden >= 8){

              ctrl.temp_estados_giro.push(iterador)

            }else{
             ctrl.temp_estados_op.push(iterador)

            }

         });

      });
  });
