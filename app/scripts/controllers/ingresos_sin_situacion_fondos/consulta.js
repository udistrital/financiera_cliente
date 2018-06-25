'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosSinSituacionFondosConsultaCtrl
 * @description
 * # IngresosSinSituacionFondosConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosSinSituacionFondosConsultaCtrl', function ($scope,$translate,financieraRequest, $localStorage,financieraMidRequest) {
    var ctrl = this;

    $scope.botones = [
        {clase_color:"ver",clase_css:"fa fa-product-hunt fa-lg faa-shake animated-hover",titulo:$translate.instant("ESTADO"),operacion:"proceso",estado:true}
    ];

    ctrl.gridIngresoNoSF = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [
          {
              field: 'IngresoSinSituacionFondos.Id',
              displayName:$translate.instant('NUMERO_OPERACION'),
              cellClass: 'input_center',
              headerCellClass:'text-info',
              width: '15%'
          },
          {
              field: 'IngresoSinSituacionFondos.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass:'input_center',
              headerCellClass:'text-info',
              width: '17%'
          },
          {
              field: 'UnidadEjecutora.Nombre',
              displayName: $translate.instant('UNIDAD_EJECUTORA'),
              cellClass:'input_center',
              headerCellClass:'text-info',
              width: '17%'
          },
          {
              field: 'EstadoIngresoSinSituacionFondos.Rubro.Codigo',
              displayName: $translate.instant('RUBRO'),
              cellClass:'input_center',
              headerCellClass:'text-info',
              width: '17%'
          },
          {
              field: 'IngresoSinSituacionFondos.ValorIngreso',
              displayName: $translate.instant('VALOR'),
              width: '17%',
              cellFilter:"currency",
              headerCellClass:'text-info',
              cellClass: 'input_right'
          },
          {
              name: $translate.instant('OPCIONES'),
              width: '17%',
              headerCellClass:'text-info',
              cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro>'
          }
      ]
    };

    ctrl.consultaIngresos = function(){
      financieraRequest.get('ingreso_sin_situacion_fondos_estado',$.param({
        query:"Activo:true",
        limit:-1,
        sortby: "Id",
        order: "asc"
      })).then(function(response){
        angular.forEach(response.data,function(rowData){
          financieraRequest.get("unidad_ejecutora/"+rowData.IngresoSinSituacionFondos.UnidadEjecutora).then(function(unidadEjec){
                rowData.UnidadEjecutora = unidadEjec.data;
              });
        });
        ctrl.gridIngresoNoSF.data =  response.data;
        console.log(response.data);
      })
    };
    ctrl.consultaIngresos();

    ctrl.cargarEstados = function() {
        financieraRequest.get("estado_ingreso_sin_situacion_fondos", $.param({
                sortby: "NumeroOrden",
                limit: -1,
                order: "asc"
            }))
            .then(function(response) {
                $scope.estados = [];
                $scope.aristas = [];
                ctrl.estados = response.data;
                console.log("estados",ctrl.estados);
                angular.forEach(ctrl.estados, function(estado) {
                    $scope.estados.push({
                        id: estado.Id,
                        label: estado.Nombre
                    });
                });
                $scope.aristas = [{
                        from: 1,
                        to: 2
                    },
                    {
                        from: 1,
                        to: 3
                    }
                ];
            });
    };
    ctrl.cargarEstados();
    $scope.loadrow = function(row, operacion) {
      $scope.solicitud = row.entity;
        switch (operacion) {
            case "proceso":
                $scope.estado = $scope.solicitud.EstadoIngresoSinSituacionFondos;
                break;
            default:
        }
    };

    $scope.funcion = function() {
        $scope.estadoclick = $localStorage.nodeclick;
        ctrl.Request = {
        IngresoSinSituacionFondos:$scope.solicitud.IngresoSinSituacionFondos,
        EstadoIngresoSinSituacionFondos: $scope.estadoclick,
        Activo:true
        };
              financieraMidRequest.post('ingreso_sin_situacion_fondos/ChangeState', ctrl.Request).then(function(response) {
                if(response.data.Type != undefined){
                  if(response.data.Type === "error"){
                      swal('',$translate.instant(response.data.Code),response.data.Type);
                    }else{
                      swal('',$translate.instant(response.data.Code),response.data.Type).then(function() {
                        ctrl.consultaIngresos();
                        $scope.estado = undefined;
                      })
                    }
                  }
                });
  }


  });
