'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionCrearFuenteCtrl
 * @description
 * # FuenteFinanciacionCrearFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.controller('crearFuenteCtrl', function ($window,$scope,financieraRequest,oikosRequest) {

var self= this;

  financieraRequest.get("fuente_financiacion", $.param({
                  limit: 0,
              })).then(function(response){
   self.fuente_financiacion=response.data;
  });

financieraRequest.get("fuente_financiacion_apropiacion", $.param({
                limit: 0,
            })).then(function(response){
     self.fuente_financiacion_apropiacion=response.data;
     self.gridOptionsfuente.data = response.data;
});

financieraRequest.get("apropiacion", $.param({
                limit: 0,
            })).then(function(response){
     self.apropiacion=response.data;
     self.gridOptionsapropiacion.data=response.data;
});

oikosRequest.get("dependencia", $.param({
                limit: 0,
            })).then(function(response){
     self.dependencia=response.data;

});

self.dependencia=['1','2'];


      self.gridOptionsfuente = {
              enableSorting: true,
              enableFiltering : true,
              enableRowSelection: true,
              enableRowHeaderSelection: false,
          columnDefs: [
                { name:'Id', field: 'Id',  visible : false},
                { name:'Fecha Creacion', field: 'FechaCreacion', cellTemplate: '<span>{{row.entity.FechaCreacion | date:"yyyy-MM-dd":"+0900"}}</span>' },
                { field: 'Valor', cellTemplate:'<div align="right">{{Valor | currency}}</div>' },
                { name:'Rubro', field: 'Apropiacion.Rubro.Codigo'},
                { name:'Fuente', field: 'Fuente.Descripcion'},
                { name:'Dependencia', field: 'Dependencia'}

              ]
            };


            self.gridOptionsapropiacion = {
                    enableSorting: true,
                    enableFiltering : true,
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,

                columnDefs: [
                      { name:'Código', field: 'Rubro.Codigo',width: '35%'},
                      { name:'Rubro', field: 'Rubro.Descripcion' ,width: '35%'},
                      { name:'Vigencia', cellTemplate:'<div align="center">{{row.entity.Vigencia}}</div>',width: '15%', },
                      { name:'Estado', field: 'Estado.Nombre',width: '15%'},

                    ]
                  };

                  self.select_id={};

                  self.gridOptionsapropiacion.onRegisterApi = function(gridApi){
                    self.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged($scope,function(row){
                      self.select_id=row.entity;
                      self.comprobarRubro(row.entity.Id);
                      console.log(self.select_id);

                      //
                    });
                  };

                  self.gridOptionsapropiacion.multiSelect = false;

                  self.rubros_seleccionados = [];

                 self.totalmont=function() {
                   self.totalMonto=0;
                    for (var i = 0; i < self.rubros_seleccionados.length; i++) {
                      if(self.rubros_seleccionados[i].ValorAsignado){
                      self.totalMonto=self.totalMonto+self.rubros_seleccionados[i].ValorAsignado;
                    }
                    }
                    console.log(self.totalMonto);
                    return self.totalMonto;
                  };




                  self.comprobarRubro = function(id){
                    var repetido=true;
                    for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){
                      console.log(self.rubros_seleccionados[i].Id);
                      if((self.rubros_seleccionados[i].Id) == id){
                        repetido=false;
                      }
                    }
                    if(repetido==true){

                    self.rubros_seleccionados.push(self.select_id);
                    var data={
                      Rubro: id,
                      Valor: 0,
                      Dependencia: ""
                    }
                    self.rubros_seleccionados[self.rubros_seleccionados.length-1].seleccionado=[];
                    self.rubros_seleccionados[self.rubros_seleccionados.length-1].seleccionado.push(data);
                    }
                  };

                  self.agregar_dependencia = function(id){

                    for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){

                      if(self.rubros_seleccionados[i].Id == id){
                        var data={
                          Rubro: id,
                          Valor: 0,
                          Dependencia: ""
                        }

                        self.rubros_seleccionados[i].seleccionado.push(data);

                      }
                    }
                    console.log(self.rubros_seleccionados)
                  };


                  self.quitarRubro = function (id){


                    for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){

                      if(self.rubros_seleccionados[i].Id == id){
                        self.rubros_seleccionados.splice(i, 1)
                      }
                    }
                  }

                  self.quitarDependencia= function (rubro,dep){

                    console.log(rubro,dep);
                    for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){

                      if(self.rubros_seleccionados[i].Id == rubro){

                        for (var j = 0 ; j < self.rubros_seleccionados[i].seleccionado.length ; j++){

                          if(self.rubros_seleccionados[i].seleccionado[j].Dependencia == dep){

                            self.rubros_seleccionados[i].seleccionado.splice(j, 1)
                          }
                        }
                      }
                    }
                  }



self.fente_encontrada=false;
self.registrar=true;
self.id=0;
self.totalMonto=0;
self.totalAsignado=0;

self.montoAsignado=function(){

  self.totalMonto=0;
  for (var i = 0; i < self.rubros_seleccionados.length; i++) {
    for (var j = 0; j  < self.rubros_seleccionados[i].seleccionado.length; j++) {
      self.totalMonto=self.totalMonto+parseInt(self.rubros_seleccionados[i].seleccionado[j].Valor);
      console.log(self.totalMonto);
    }
  }
  console.log(self.totalMonto);
  if(self.totalMonto <= self.nueva_fuente_apropiacion.Monto){
      console.log("si");
    return true;
  }else{
      console.log("no");
    return false;
  }
};


self.crear_fuente= function(){

  if (self.nueva_fuente.Codigo==null) {
    swal("Error", "Debe Ingresar el Codigo de la Fuente de Financiación", "error");
  }
  else if(self.nueva_fuente.Sigla==null){
    swal("Error", "Debe Ingresar la Sigla de la Fuente de Financiación", "error");
  }
  else if(self.nueva_fuente.Descripcion==null){
    swal("Error", "Debe Ingresar la Descripcion de la Fuente de Financiación", "error");
  }
  else if(self.nueva_fuente_apropiacion.Monto==null){
    swal("Error", "Debe Ingresar el Monto de la Fuente de Financiación", "error");
  }
  else if(self.nueva_fuente_apropiacion.Fechainicio==null){
    swal("Error", "Debe Ingresar la Fecha de la Fuente de Financiación", "error");
  }else{

    for (var i = 0; i < self.rubros_seleccionados.length; i++) {
      for (var j = 0; j  < self.rubros_seleccionados[i].seleccionado.length; j++) {
        if (self.rubros_seleccionados[i].seleccionado[j].Valor==0) {
            swal("Error", "Debe Ingresar el Valor Correspondiente al Rubro Seleccionado", "error");
            self.registrar=false;
        }
        else if (self.rubros_seleccionados[i].seleccionado[j].Dependencia==0) {
            swal("Error", "Debe Ingresar la Dependencia Correspondiente al Rubro Seleccionado", "error");
            self.registrar=false;
        }
      }
    }
    if(self.registrar){
    if(self.montoAsignado()){

  for (var i = 0; i < self.fuente_financiacion.length; i++) {
    if (self.fuente_financiacion[i].Codigo==self.nueva_fuente.Codigo) {
      self.asignar_rubros(self.fuente_financiacion[i].Id);
      self.fente_encontrada=true;
      swal("Proceso Completado", "La Fuente de Financiación se ha registrado con exito", "success");
      /* self.nueva_fuente={};
       self.rubros_seleccionados=[];
       self.nueva_fuente_apropiacion={};*/
      $window.location.href = '#/fuente_financiacion/consulta_fuente';
    }
  }



  var data={
    Codigo: self.nueva_fuente.Codigo,
    Sigla: self.nueva_fuente.Sigla,
    Descripcion: self.nueva_fuente.Descripcion
  }

  if(!self.fente_encontrada){

  financieraRequest.post("fuente_financiacion",data).then(function(response){
     self.fuente_financiacion=response.data;
     console.log("resultado =]");
     console.log(response.data);
     console.log(response.data.Id);
     self.id=response.data.Id;
     self.asignar_rubros(self.id);
     swal("Proceso Completado", "La Fuente de Financiación se ha registrado con exito", "success");
    /* self.nueva_fuente={};
     self.rubros_seleccionados=[];
     self.nueva_fuente_apropiacion={};*/
     $window.location.href = '#/fuente_financiacion/consulta_fuente';

   });
}
  }
  else{

    swal("Error", "El Monto Ingrasado Supera el Valor de la Fuente de Financiación", "error");
 }
 }
 }

};

self.asignar_rubros= function(id){

  for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){
    console.log("rubro");

    console.log(id);
    console.log(self.rubros_seleccionados[i].seleccionado);


    for (var j = 0; j  < self.rubros_seleccionados[i].seleccionado.length; j++) {

      self.crear_fuente_apropiacion(id,self.rubros_seleccionados[i].seleccionado[j].Rubro, self.rubros_seleccionados[i].seleccionado[j].Dependencia,self.rubros_seleccionados[i].seleccionado[j].Valor);

    }


  }

/*    self.nueva_fuente={};
  self.nueva_fuente_apropiacion={};
  self.rubros_seleccionados=[];
*/

};



     self.toggle = function (item, list) {
       var idx = list.indexOf(item);
       if (idx > -1) {
         list.splice(idx, 1);
       }
       else {
         list.push(item);
       }
     };

self.selected_fuente = [];

self.borrar_fuente= function(){

  self.tam=(self.selected_fuente.length);

  for (var j = 0; j < self.tam; j++) {

  self.id=self.selected_fuente[j];
  financieraRequest.delete("fuente_financiacion",self.id).then(function(response){

    financieraRequest.get("fuente_financiacion", $.param({
                    limit: 0,
                })).then(function(response){
       self.fuente_financiacion=response.data;
     });

   });
 }


};


self.crear_fuente_apropiacion= function(fuente,rubro,dependencia,valor){

  var data={

    Valor: parseInt(valor),
    FechaCreacion: self.nueva_fuente_apropiacion.Fechainicio,
    Dependencia: parseInt(dependencia),

    Apropiacion: {
        Id: parseInt(rubro)
    },
    Fuente: {
        Id: parseInt(fuente)
    }
  }
  console.log(data);

  financieraRequest.post("fuente_financiacion_apropiacion",data).then(function(response){
       self.fuente_financiacion_apropiacion.push(response.data);
       console.log(response.data);
  });



};



self.selected_ffinanciamiento = [];

self.borrar_fuente_financiamiento= function(){

  self.tam=(self.selected_ffinanciamiento.length);

  for (var j = 0; j < self.tam; j++) {

  self.id=self.selected_ffinanciamiento[j];
  financieraRequest.delete("fuente_entidad",self.id).then(function(response){

    financieraRequest.get("fuente_entidad", $.param({
                    limit: 0,
                })).then(function(response){
         self.fuente_entidad=response.data;
    });


   });
 }

};



});
