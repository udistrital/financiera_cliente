'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOrdenPagoCtrl
 * @description
 * # OrdenPagoOrdenPagoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoCtrl', function (financieraRequest, administrativaRequest,$scope, $location, $http, $window) {

    $scope.gridOrdenesDePago = {};
    $scope.gridOrdenesDePago.columnDefs = [
      {
        name: 'Id',
        displayName: "Id",
      },
      {
        name: 'Vigencia',
        displayName: "Vigencia",
      },
      {
        name: 'VigenciaPresupuestal',
        displayName: "Vigencia Presupuestal",
      },
      {
        name: 'UnidadEjecutoraId.Nombre',
        displayName: "Unidad Ejecutora",
      },
      {
        name: 'Estado.Descripcion',
        displayName: "Estado",
      },
      {
        //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
        name: 'Operacion',
        cellTemplate: '<button type="button" class="btn btn-success btn-circle" ng-click="grid.appScope.goWithOrdenesDePago(row)"><i class="glyphicon glyphicon-eye-open"></i></button> <button type="button" class="btn btn-info btn-circle"><i class="glyphicon glyphicon-pencil"></i></button> <button ng-click="grid.appScope.deleteOrdenDePago(row)" type="button" class="btn btn-danger btn-circle"><i class="fa fa-times"></i></button> '
      }
    ];
    // function link
    $scope.go = function(path){
      $location.url(path);
    };
    $scope.go_with_parameter = function(path, parameter){
      $location.url(path + parameter);
    };
    $scope.goWithOrdenesDePago = function(row){
      var Id = row.entity.Id;
      $scope.go_with_parameter("ordenes_de_pago_view/", Id);
    }
    // fin function link
    $scope.deleteRow = function(row) {
      var index = $scope.gridOptions.data.indexOf(row.entity);
      $scope.gridOptions.data.splice(index, 1);
    };
    //
    $scope.deleteOrdenDePago = function(orden){
       $http.delete(api_path02 + "ordenes_de_pago/" + orden.entity.Id, orden)
            .then(function (data, status, header) {
                $window.location.reload();
            })
            .catch(function (data, status, header, config) {
                $scope.ServerResponse =  status  + "----" + header + "----" + data;
                console.log(status  + "----" + header + "----" + data + '----' + config)
            });
    }
    //
    financieraRequest.get("orden_pago", "")
      .then(function(response){
        $scope.gridOrdenesDePago.data = response.data;
      });
  //
  });
