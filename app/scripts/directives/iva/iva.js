'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:iva/iva
 * @description
 * # iva/iva
 */
angular.module('financieraClienteApp')
  .directive('iva', function (financieraRequest) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */

      templateUrl: 'views/directives/iva/iva.html',
      controller:function($scope){
        var self = this;
        $scope.boton_crear_iva = false;
        $scope.categoria_selet = {};
        $scope.nuevo_iva = null;
        $scope.actualizar_iva=null;

        // grid Iva Categoria
        $scope.gridIvaCategoria = {
          enableFiltering: true,
          onRegisterApi: function(gridApi){
            $scope.gridApi = gridApi;
          }
        };
        $scope.gridIvaCategoria.columnDefs = [
          {
            name: 'Id',
            displayName: "Id",
          },
          {
            name: 'Nombre',
            displayName: "Nombre",
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: 'Operacion',
             enableFiltering: false,
            cellTemplate:
            '<center><button ng-click="grid.appScope.cargar_ivas(row)" type="button" class="btn btn-success btn-circle"><i class="glyphicon glyphicon-eye-open""></i></button></center>'
          }
        ];
        // grid Iva Categoria
        $scope.gridIva = {
          enableFiltering: true,
          onRegisterApi: function(gridApi){
            $scope.gridApi = gridApi;
          }
        };
        $scope.gridIva.columnDefs = [
          {
            name: 'Id',
            displayName: "Id",
          },
          {
            name: 'CategoriaIva.Nombre',
            displayName: "Categoria",
          },
          {
            name: 'Valor',
            displayName: "Valor",
          },
          {
            //<button class="btn primary" ng-click="grid.appScope.deleteRow(row)">Delete</button>
            name: 'Operacion',
             enableFiltering: false,
            cellTemplate:
            '<center><button ng-click="grid.appScope.get_iva(row)" type="button" class="btn btn-success btn-circle"><i class="glyphicon glyphicon-pencil""></i></button></center>'
          }
        ];
        //get categorias
        financieraRequest.get("categoria_iva",
          $.param({
            query:"estado_activo:True"
          })
        ).then(function(response) {
          $scope.gridIvaCategoria.data = response.data;
        });
        //get ivas de una categoria
        $scope.cargar_ivas = function(categoria){
          //console.log(categoria);
          $scope.categoria_selet = categoria.entity;
          $scope.boton_crear_iva=true;
          financieraRequest.get("iva",
            $.param({
              query:"estado_activo:True,categoria_iva:"+categoria.entity.Id,
              limit:0,
            })
          ).then(function(response) {
            $scope.gridIva.data = response.data;
          });
        };
        // get iva
        $scope.get_iva=function(iva){
          //console.log(iva);
          if ($scope.ver_crear_iva == true){
            $scope.ver_crear_iva = !$scope.ver_crear_iva;
          }
          $scope.boton_crear_iva = !$scope.boton_crear_iva;
          $scope.var_actualizar_iva = !$scope.var_actualizar_iva;
          //
          $scope.actualizar_iva = iva.entity;
        }
        // update iva
        $scope.actualiza_iva=function(){
          if($scope.actualizar_iva){
            financieraRequest.put("iva",$scope.actualizar_iva.Id ,$scope.actualizar_iva).then(function(response){
              console.log(response.data)
              $scope.cargar_ivas({'name': 'hola', 'entity': $scope.categoria_selet})
              $scope.actualizar_iva=null;
            });
          }
        }
        // add iva
        $scope.agregar_iva=function(){
          if($scope.nuevo_iva){
            $scope.nuevo_iva.CategoriaIva = $scope.categoria_selet;
            $scope.nuevo_iva.EstadoActivo = true;
            financieraRequest.post("iva", $scope.nuevo_iva).then(function(response){
              $scope.cargar_ivas({'name': 'hola', 'entity': $scope.categoria_selet})
              $scope.nuevo_iva=null;
            });
          }
        }
      },
      controllerAs:'d_iva'
    };
  });
