'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:necesidad/necesidaListar
 * @description
 * # necesidad/necesidaListar
 */
angular.module('financieraClienteApp')
  .directive('necesidaListar', function ($translate, administrativaRequest, agoraRequest, financieraMidRequest, financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          inputpestanaabierta: '=?',
          outputnecesidad: '=?',
        },

      templateUrl: 'views/directives/necesidad/necesida_listar.html',
      controller:function($scope){
        var self = this;

        self.gridOptions_necesidad = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [10, 50, 100],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 10,
          useExternalPagination: false,

          // inicio sub tabla
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
          onRegisterApi: function (gridApi) {
           gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
             if (row.isExpanded) {
               row.entity.subGridOptions = {
                 columnDefs: [
                   { field: 'registro_presupuestal.Id', visible: false},
                   {
                     field: 'RegistroPresupuestalDisponibilidadApropiacion[0].DisponibilidadApropiacion.Disponibilidad.NumeroDisponibilidad',
                     displayName: $translate.instant('NO_CRP'),
                     width: '10%',
                     cellClass: 'input_center'
                   },
                   {
                     field: 'Beneficiario',
                     displayName: $translate.instant('NO_CRP'),
                     width: '10%',
                     cellClass: 'input_center'
                   }
                 ]};
                 //
                //  financieraRequest.get('rubro',
                //  $.param({
                //    query: "Id:35480",
                //  })).then(function(response) {
                //     if (response == null){
                //       console.log("no data");
                //     }else{
                //      console.log(response.data);
                //      row.entity.subGridOptions.data = response.data;
                //    }
                //  });
                 //
                 financieraMidRequest.get("disponibilidad/DisponibilidadByNecesidad/122")
                 .then(function(data) {
                   console.log("AAAAAAAAAAA");
                   console.log(data.data[0]);
                   console.log("AAAAAAAAAAA");
                   row.entity.subGridOptions.data = data.data[0].registro_presupuestal;
                 })

               }
             });
           },
           // fin sub tabla

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Necesidad.Numero',
              displayName: $translate.instant('DOCUMENTO'),
              cellClass: 'input_center',
              width:'11%',
            },
            {
              field: 'Necesidad.Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              width:'9%',
            },
            {
              field: 'Necesidad.Valor',
              displayName: $translate.instant('VALOR'),
              width:'11%',
            },
            {
              field: 'Necesidad.DiasDuracion',
              displayName: $translate.instant('DURACION'),
              width:'9%',
            },
            {
              field: 'Necesidad.Estado.Nombre',
              displayName: $translate.instant('ESTADO'),
              width:'10%',
            },
            {
              field: 'Necesidad.Objeto',
              displayName: $translate.instant('OBJETO'),
            },
            {
              field: 'Necesidad.Justificacion',
              displayName: $translate.instant('JUSTIFICACION'),
            },
          ]
        };
        //
        administrativaRequest.get('solicitud_disponibilidad',
          $.param({
            query: "Expedida:true",
            limit: -1
          })).then(function(response) {
          self.gridOptions_necesidad.data = response.data;
        });

        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta){
            $scope.a = true;
          }
        })
        // fin
      },
      controllerAs:'d_necesidaListar'
    };
  });
