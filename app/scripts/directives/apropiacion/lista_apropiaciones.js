'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/listaApropiaciones
 * @description
 * # apropiacion/listaApropiaciones
 */
angular.module('financieraClienteApp')
  .directive('listaApropiaciones', function (financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          apropiacion:'=',
          vigencia : "=",
          tipo : "="
        },

      templateUrl: 'views/directives/apropiaciones/lista_apropiaciones.html',
      controller:function($scope){
        var self = this;
        self.gridOptions = {
          enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,

      columnDefs : [
        {field: 'Id',             visible : false},
        {field: 'Rubro.Codigo',   displayName: 'Codigo Rubro'},
        {field: 'Rubro.Descripcion',   displayName: 'Descripcion Rubro'},
        {field: 'Valor',   displayName: 'Valor', cellFilter: 'currency'},
        {field: 'Saldo' ,cellFilter: 'currency'}
      ]

    };

    self.cargarSaldos = function(){
      angular.forEach(self.gridOptions.data, function(data){
        financieraRequest.get('apropiacion/SaldoApropiacion/'+data.Id,'query=Vigencia:'+$scope.vigencia+",Rubro.Codigo__startswith:"+$scope.tipo).then(function(response) {

          //console.log(response.data);
          data.Saldo = response.data;
        });
        });
      }

      financieraRequest.get('apropiacion','limit=0&query=Vigencia:'+$scope.vigencia+",Rubro.Codigo__startswith:"+$scope.tipo).then(function(response) {
        self.gridOptions.data = response.data.sort(function(a,b){
          if(a.Rubro.Codigo < b.Rubro.Codigo) return -1;
          if(a.Rubro.Codigo > b.Rubro.Codigo) return 1;
          return 0;});
        var max_level = 0;
        var level = 0;
        for (var i=0; i < self.gridOptions.data.length; i++){
          level = (self.gridOptions.data[i].Rubro.Codigo.match(/-/g) || []).length;
            if (level > max_level){
              max_level = level;
            };
        };

        for (var i=0; i < self.gridOptions.data.length; i++){
          level = (self.gridOptions.data[i].Rubro.Codigo.match(/-/g) || []).length;
          //console.log(level);
          if(level < max_level){
              self.gridOptions.data[i].$$treeLevel = level;
          };
        };
        self.cargarSaldos();
      });

      //self.gridApi.core.refresh();
      self.actualiza_rubros = function () {
        financieraRequest.get('apropiacion' ,'limit=0&query=Vigencia:'+$scope.vigencia+",Rubro.Codigo__startswith:"+$scope.tipo).then(function(response) {
          self.gridOptions.data = response.data.sort(function(a,b){
            if(a.Rubro.Codigo < b.Rubro.Codigo) return -1;
            if(a.Rubro.Codigo > b.Rubro.Codigo) return 1;
            return 0;});
          var max_level = 0;
          var level = 0;
          for (var i=0; i < self.gridOptions.data.length; i++){
            level = (self.gridOptions.data[i].Rubro.Codigo.match(/-/g) || []).length;
              if (level > max_level){
                max_level = level;
              };
          };

          for (var i=0; i < self.gridOptions.data.length; i++){
            level = (self.gridOptions.data[i].Rubro.Codigo.match(/-/g) || []).length;
            //console.log(level);
            if(level < max_level){
                self.gridOptions.data[i].$$treeLevel = level;
            };
          };

        });
        };

        self.gridOptions.onRegisterApi = function(gridApi){
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
            $scope.apropiacion = row.entity;
          });
        };


        self.gridOptions.multiSelect = false;

      },
      controllerAs:'d_listaApropiaciones'
    };
  });
