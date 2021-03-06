'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:proveedor/pvListar
 * @description
 * # proveedor/pvListar
 */
angular.module('financieraClienteApp')
  .directive('pvListar', function(agoraRequest, coreRequest, $translate) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        outputproveedor: '='
      },

      templateUrl: 'views/directives/proveedor/pv_listar.html',
      controller: function($scope) {
        var self = this;
        self.cargando = true;
        self.hayData = true;
        self.banco_proveedor = {};
        self.tel_proveedor = {};

        self.gridOptions_proveedor = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [13, 50, 100],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 13,
          useExternalPagination: false,

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'NumDocumento',
              displayName: $translate.instant('NO_DOCUMENTO'),
              width: '21%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'NomProveedor',
              displayName: $translate.instant('NOMBRE'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Tipopersona',
              displayName: $translate.instant('TIPO_PERSONA'),
              width: '20%',
              cellClass: 'input_center',
              headerCellClass: 'encabezado'

            }
          ]
        };
        //
        agoraRequest.get('informacion_proveedor',
          $.param({
            query: "Estado.ValorParametro:ACTIVO",
            limit: -1
          })).then(function(response) {

            if (response.data === null) {
                self.hayData = false;
                self.cargando = false;
                  self.gridOptions_proveedor.data = [];
            } else {
                self.hayData = true;
                self.cargando = false;
                self.gridOptions_proveedor.data = response.data;
            }


        });
        //
        self.gridOptions_proveedor.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if (self.gridApi.selection.getSelectedRows()[0] != undefined) {
              $scope.outputproveedor = self.gridApi.selection.getSelectedRows()[0];
              // datos banco
              self.get_info_banco($scope.outputproveedor.IdEntidadBancaria)
              // dato telefono
              self.get_tel_provee($scope.outputproveedor.Id)
            } else {
              $scope.outputproveedor = {};
              self.banco_proveedor.NombrePerfilEntidad = $translate.instant('NO_ENCONTRADO');
              self.tel_proveedor.IdTelefono.NumeroTel = $translate.instant('NO_ENCONTRADO');
            }
          });
        };
        self.gridOptions_proveedor.multiSelect = false;
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta) {
            $scope.a = $scope.inputpestanaabierta;

          }
        })
        //
        self.get_info_banco = function(id_banco) {
          agoraRequest.get('informacion_persona_juridica_tipo_entidad',
            $.param({
              query: "TipoEntidadId:1,Id:" + id_banco,
            })).then(function(response) {
              if(response.data === null){
                self.banco_proveedor.NombrePerfilEntidad = $translate.instant('NO_ENCONTRADO');
              }else{
                self.banco_proveedor.NombrePerfilEntidad = response.data[0].NombrePerfilEntidad ;
              }

          });
        }
        //
        //
        self.get_tel_provee = function(id_prove) {
          agoraRequest.get('proveedor_telefono',
            $.param({
              query: "Id:" + id_prove,
            })).then(function(response) {
            self.tel_proveedor = response.data[0];
          });
        }
      },
      controllerAs: 'd_pvListar'
    };
  });
