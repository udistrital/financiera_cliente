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
      scope: {
        apropiacion: '=',
        vigencia: "=",
        tipo: "=",
        selhijos: "=?"
      },

      templateUrl: 'views/directives/apropiaciones/lista_apropiaciones.html',
      controller: function($scope, uiGridConstants) {
        var self = this;
        self.gridOptions = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableFiltering: true,
          showTreeExpandNoChildren: false,

          columnDefs: [{
              field: 'Rubro.Codigo',
              displayName: 'Codigo Rubro',
              headerCellClass: $scope.highlightFilteredHeader + 'text-center ',
              cellClass: function(row, col) {
                if (col.treeNode.children.length == 0) {
                  return "unbold "
                } else {
                  return "text-info"
                }
              },
              width: '15%'
            },
            {
              field: 'Rubro.Descripcion',
              displayName: 'Descripcion Rubro',
              headerCellClass: $scope.highlightFilteredHeader + 'text-center ',
              cellTooltip: function(row, col) {
                return row.entity.Rubro.Descripcion;
              },
              cellClass: function(row, col) {
                if (col.treeNode.children.length == 0) {
                  return "unbold "
                }else {
                  return "text-info"
                }
              },
              width: '38%'
            },
            {
              field: 'Valor',
              displayName: 'Valor',
              cellFilter: 'currency',
              headerCellClass: $scope.highlightFilteredHeader + 'text-center ',
              cellClass: function(row, col) {
                if (col.treeNode.children.length == 0) {
                  return "unbold"
                }else {
                  return "text-info"
                }
              },
              width: '20%'
            },
            {
              field: 'Saldo',
              cellFilter: 'currency',
              headerCellClass: $scope.highlightFilteredHeader + 'text-center ',
              cellClass: function(row, col) {
                if (col.treeNode.children.length == 0) {
                  return "unbold"
                }else {
                  return "text-info"
                }
              },
              width: '20%'
            }
          ]

        };

        self.cargarSaldos = function() {
          angular.forEach(self.gridOptions.data, function(data) {
            financieraRequest.get('apropiacion/SaldoApropiacion/' + data.Id, 'query=Vigencia:' + $scope.vigencia + ",Rubro.Codigo__startswith:" + $scope.tipo).then(function(response) {

              //console.log(response.data);
              data.Saldo = response.data;
            });
          });
        }

        financieraRequest.get('apropiacion', 'limit=0&query=Vigencia:' + $scope.vigencia + ",Rubro.Codigo__startswith:" + $scope.tipo).then(function(response) {

          self.gridOptions.data = response.data.sort(function(a, b) {
            if (a.Rubro.Codigo < b.Rubro.Codigo) return -1;
            if (a.Rubro.Codigo > b.Rubro.Codigo) return 1;
            return 0;
          });
          self.max_level = 0;
          var level = 0;
          for (var i = 0; i < self.gridOptions.data.length; i++) {
            level = (self.gridOptions.data[i].Rubro.Codigo.match(/-/g) || []).length;
            if (level > self.max_level) {
              self.max_level = level;
            };
          };

          for (var i = 0; i < self.gridOptions.data.length; i++) {
            level = (self.gridOptions.data[i].Rubro.Codigo.match(/-/g) || []).length;
            //console.log(level);
            if (level < self.max_level) {
              self.gridOptions.data[i].$$treeLevel = level;
            };
          };
          self.cargarSaldos();
        });

        //self.gridApi.core.refresh();
        self.actualiza_rubros = function() {
          financieraRequest.get('apropiacion', 'limit=0&query=Vigencia:' + $scope.vigencia + ",Rubro.Codigo__startswith:" + $scope.tipo).then(function(response) {
            self.gridOptions.data = response.data.sort(function(a, b) {
              if (a.Rubro.Codigo < b.Rubro.Codigo) return -1;
              if (a.Rubro.Codigo > b.Rubro.Codigo) return 1;
              return 0;
            });
            self.max_level = 0;
            var level = 0;
            for (var i = 0; i < self.gridOptions.data.length; i++) {
              level = (self.gridOptions.data[i].Rubro.Codigo.match(/-/g) || []).length;
              if (level > self.max_level) {
                self.max_level = level;
              };
            };

            for (var i = 0; i < self.gridOptions.data.length; i++) {
              level = (self.gridOptions.data[i].Rubro.Codigo.match(/-/g) || []).length;
              //console.log(level);
              if (level < self.max_level) {
                self.gridOptions.data[i].$$treeLevel = level;
              };
            };

          });
        };



        self.gridOptions.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          console.log(self.gridApi);
          self.gridApi.grid.registerDataChangeCallback(function() {
            self.gridApi.treeBase.expandAllRows();
          });
          self.gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.apropiacion = row.entity;
            //console.log(row);
          });
        };

        self.gridOptions.isRowSelectable = function(row) {
          if (row.treeNode.children.length > 0 && $scope.selhijos==true) {
            return false;
          } else {
            return true;
          }
        };


        self.gridOptions.multiSelect = false;

        //self.setSelectable();

        //self.setSelectable();

      },
      controllerAs:'d_listaApropiaciones'
    };
  });
