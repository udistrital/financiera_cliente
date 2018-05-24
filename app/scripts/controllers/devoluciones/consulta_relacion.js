'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesConsultaRelacionCtrl
 * @description
 * # DevolucionesConsultaRelacionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesConsultaRelacionCtrl', function ($scope,$translate,financieraRequest,$localStorage) {
    var ctrl = this;

    $scope.estado_select = [];
    $scope.estados = [];
    $scope.tipos = [];
    $scope.estado_select = [];
    $scope.aristas = [];
    $scope.estadoclick = {};
    $scope.senDataEstado = {};

    $scope.botones = [
        { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('ESTADO'), operacion: 'proceso', estado: true },
    ];

    ctrl.gridOrdenes = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [
          {
              field: 'Id',
              displayName:$translate.instant('NUMERO_OPERACION'),
              cellClass: 'input_center',
              width: '20%'
          },
          {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass:'input_center',
              width: '20%'
          },
          {
              field: 'UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              cellClass:'input_center',
              width: '20%'
          },
          {
              field: 'ValorTotal',
              displayName: $translate.instant('VALOR'),
              width: '20%',
              cellFilter:"currency",
              cellClass: 'input_right'
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '20%',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ]
    };

    ctrl.cargarRelaciones=function(){
      financieraRequest.get('orden_devolucion',$.param({
        limit: -1
      })).then(function(response){
        if(response.data != undefined){
          angular.forEach(response.data, function(rowData) {
            var est = [];
            financieraRequest.get("orden_devolucion_estado_devolucion", $.param({
                    query: "Devolucion:" + rowData.Id + ",Activo:true",
                    fields: "EstadoDevolucion",
                    limit: -1
                })).then(function(estado){
                  console.log("estados",estado);
                  angular.forEach(estado.data, function(rowData) {
                    est.push(rowData.EstadoDevolucion);
                  });
                  rowData.Estado = est;
                });
          });
          ctrl.gridOrdenes.data = response.data;
        }
      });
    };

    ctrl.cargarEstados = function() {
        financieraRequest.get("estado_devolucion", $.param({
                query:"Tipo:2",
                sortby: "NumeroOrden",
                limit: -1,
                order: "asc"
            }))
            .then(function(response) {
                $scope.estados = [];
                $scope.aristas = [];
                ctrl.estados = response.data;
                angular.forEach(ctrl.estados, function(estado) {
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
                        from: 1,
                        to: 3
                    },
                    {
                        from: 2,
                        to: 4
                    },
                    {
                        from: 2,
                        to: 5
                    }
                ];
            });
    };


    ctrl.cargarRelaciones();
    ctrl.cargarEstados();


    $scope.loadrow = function(row, operacion) {
        $scope.solicitud = row.entity;
        console.log("fila seleccionada ",$scope.solicitud)
        switch (operacion) {
            case "proceso":
                $scope.estado = $scope.solicitud.Estado ;
                break;
            case "otro":

                break;
            default:
        }
    };

    $scope.funcion = function() {
        $scope.estadoclick = $localStorage.nodeclick;
        ctrl.Request = {
          estadoOrdenDevol:{
          EstadoDevolucion:$scope.estadoclick,
        },
          ordenDevolucion:{
            Id:$scope.solicitud.Id
          }
        };
              financieraRequest.post('orden_devolucion_estado_devolucion/AddEstadoOrdenDevol', ctrl.Request).then(function(response) {
                if(response.data.Type != undefined){
                  if(response.data.Type === "error"){
                      swal('',$translate.instant(response.data.Code),response.data.Type);
                    }else{
                      swal('',$translate.instant(response.data.Code),response.data.Type).then(function() {
                        ctrl.cargarRelaciones();
                      })
                    }
                  }
                });
  }


  });
