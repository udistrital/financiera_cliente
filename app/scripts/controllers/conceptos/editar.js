'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ConceptosEditarCtrl
 * @description
 * # ConceptosEditarCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('conceptosEditarCtrl', function($scope, financieraRequest, $routeParams, $translate, $location) {
      var self = this;
      $scope.btnagregar=$translate.instant('BTN.AGREGAR');

      self.cargar_concepto = function() {
        financieraRequest.get("concepto", $.param({
          query: "Codigo:" + $routeParams.Codigo
        })).then(function(response) {
          self.e_concepto = response.data[0];
          $scope.isconcepto=!self.e_concepto.Clasificador;
          self.codigo_original= self.e_concepto.Codigo;
          financieraRequest.get("concepto_concepto", $.param({
            query: "ConceptoHijo:" + self.e_concepto.Id,
            fields: "ConceptoPadre"
          })).then(function(response) {
            self.cpadre =(response.data==null)?null:response.data[0].ConceptoPadre;
            self.padre_original=angular.copy(self.cpadre);
            self.actualizar_codigo();
          });

          financieraRequest.get("afectacion_concepto", $.param({
            query: "Concepto.Id:" + self.e_concepto.Id
          })).then(function(response) {
            if (response.data == null) {
              financieraRequest.get("tipo_afectacion", "").then(function(response) {
                self.e_afectaciones=[];
                for (var i = 0; i < response.data.length; i++) {
                  self.e_afectaciones.push(
                    {TipoAfectacion:response.data[i],
                    Concepto: self.e_concepto});
                }
              });
            } else {
              self.e_afectaciones = response.data;
            }
          });

          self.e_concepto.FechaExpiracion = new Date(self.e_concepto.FechaExpiracion);
          self.cuentas = [];

          for (var i = 0; i < self.e_concepto.ConceptoCuentaContable.length; i++) {
            self.cuentas.push(self.e_concepto.ConceptoCuentaContable[i].CuentaContable)
          }
          self.e_cuentas = angular.copy(self.cuentas);
        });
      };

      self.actualizar_codigo=function(){
        if (self.cpadre != null) {
          self.e_concepto.Codigo1= self.cpadre.Codigo+"-";
          self.e_concepto.Codigo2= self.e_concepto.Codigo2?self.e_concepto.Codigo2:self.e_concepto.Codigo.substring(self.cpadre.Codigo.length+1,self.e_concepto.Codigo.length);
          self.e_concepto.TipoConcepto=self.cpadre.TipoConcepto
        } else {
          self.e_concepto.Codigo1= "";
          self.e_concepto.Codigo2= self.e_concepto.Codigo2?self.e_concepto.Codigo2:self.e_concepto.Codigo;
        }
      };

      self.cambiar_padre=function(){
        $scope.varbolpadre=true;
      };

      self.cancelar_padre=function(){
        $scope.varbolpadre=false;
        self.cpadre=self.padre_original;
        self.e_concepto.Codigo=self.codigo_original;
        self.e_concepto.Codigo1=null;
        self.e_concepto.Codigo2=null;
        self.actualizar_codigo();
      };


      self.agregar_cuentas = function() {
        if (self.e_cuentas.indexOf(self.cuenta_contable) < 0 && self.cuenta_contable != undefined) {
          if (self.cuenta_contable.Hijos == null) {
            var exist = false;
            for (var i = 0; i < self.e_cuentas.length; i++) {
              if (self.e_cuentas[i].Codigo == self.cuenta_contable.Codigo) {
                exist = true;
              }
            }
            if (!exist) {
              self.e_cuentas.push(self.cuenta_contable);
            }
            self.cuenta_contable = undefined;
          } else {
            swal("Espera!", "Unicamente puedes seleccionar cuentas que no tengan hijos", "warning");
            self.cuenta_contable = undefined;
          }
        }
      };

      self.quitar_cuentas = function(i) {
        self.e_cuentas.splice(i, 1);
      };

      self.cargar_plan_maestro = function() {
        financieraRequest.get("plan_cuentas", $.param({
          query: "PlanMaestro:" + true
        })).then(function(response) {
          self.plan_maestro = response.data[0];
        });
      };

      self.editar_concepto = function() {

        swal({
          title: $translate.instant('ACTUALIZAR_CONCEPTO') + '!',
          text: $translate.instant('DESEA_ACTUALIZAR_CONCEPTO'),
          type: 'info',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          confirmButtonText: $translate.instant('BTN.CONFIRMAR'),
          cancelButtonText: $translate.instant('BTN.CANCELAR'),
          buttonsStyling: false
        }).then(function() {
            var del_cuentas = [];
            var add_cuentas = angular.copy(self.e_cuentas);
            for (var i = 0; i < self.cuentas.length; i++) {
              var exist = false;
              var index;
              for (var j = 0; j < add_cuentas.length; j++) {
                if (add_cuentas[j].Codigo == self.cuentas[i].Codigo) {
                  exist = true;
                  index = j;
                }
              }
              if (!exist) {
                del_cuentas.push(self.e_concepto.ConceptoCuentaContable[i]);
                //console.log("eliminar",self.cuentas[i].Codigo );
              } else {
                //add_cuentas.push(self.e_cuentas[index])
                add_cuentas.splice(index, 1);
              }
            }
            self.e_concepto.Codigo=self.e_concepto.Codigo1+self.e_concepto.Codigo2;
            self.e_concepto.Clasificador=!$scope.isconcepto;
            var tr_concepto = {
              ConceptoPadre: self.cpadre,
              Concepto: self.e_concepto,
              Afectaciones: self.e_afectaciones,
              Cuentas: add_cuentas,
              DelCuentas: del_cuentas
            };

            financieraRequest.put('tr_concepto', self.e_concepto.Id, tr_concepto).then(function(response) {
              if (response.data.Type == 'success') {
                swal($translate.instant(response.data.Code), $translate.instant("CONCEPTO") + " " + response.data.Body, response.data.Type);
                $location.path('conceptos/editar/'+response.data.Body);
                //self.recargar = !self.recargar;
                self.cargar_concepto();
              } else {
                swal("", $translate.instant(response.data.Code), response.data.Type);
              }
            });
          });
        };

        self.gridOptions = {
          paginationPageSizes: [5, 10, 15, 20, 50],
          paginationPageSize: 5,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          useExternalPagination: false,
          enableRowSelection: true,
          enableRowHeaderSelection: true,
          enableFiltering: true,
          enableSorting: true,
          columnDefs: [{
              headerCellClass: 'text-success',
              displayName: $translate.instant('CODIGO'),
              field: 'Codigo',
              cellTooltip: function(row) {
                return row.entity.Codigo;
              },
              width: '30%'
            },
            {
              headerCellClass: 'text-success',
              displayName: $translate.instant('NOMBRE'),
              field: 'Nombre',
              cellTooltip: function(row) {
                return row.entity.Nombre;
              },
              width: '68%'
            }
          ]
        };

        self.gridOptions.multiSelect = false;
        //self.gridOptions.noUnselect = true;
        self.gridOptions.onRegisterApi = function(gridApi) {
          $scope.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function() {
            self.e_concepto.Rubro = $scope.gridApi.selection.getSelectedRows()[0];
          });
        };
        financieraRequest.get('rubro', $.param({
          limit: -1
        })).then(function(response) {
          self.gridOptions.data = response.data;
        });

        self.cargar_plan_maestro();
        self.cargar_concepto();

        $scope.$watch('conceptosEditar.cpadre', function() {
          self.actualizar_codigo();
        }, true);

        $scope.$watch('conceptosEditar.cuenta_contable', function() {
          self.agregar_cuentas();
        }, true);

      });
