'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:FuenteFinanciacionModificacionFuenteCtrl
 * @description
 * # FuenteFinanciacionModificacionFuenteCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
.controller('modificacionFuenteCtrl' , function ($window,$scope,financieraRequest,$translate,oikosRequest,$timeout) {

var self= this;


  financieraRequest.get("fuente_financiacion",'limit=-1&sortby=descripcion&order=asc').then(function(response){
   self.fuente_financiacion=response.data;
  });

financieraRequest.get("fuente_financiacion_apropiacion",'limit=-1').then(function(response){
     self.fuente_financiacion_apropiacion=response.data;
});

financieraRequest.get("apropiacion",'limit=-1&query=rubro.codigo__startswith:3-3&sortby=rubro&order=asc&query=vigencia:'+self.fecha).then(function(response){
     self.apropiacion=response.data;
     self.gridOptionsapropiacion.data=response.data;
});

oikosRequest.get("dependencia", $.param({
                limit: -1,
            })).then(function(response){
     self.dependencia=response.data;

});

self.tipo=[{ Id:'1', Nombre: $translate.instant('ADICION')},{ Id:'2', Nombre: $translate.instant('TRANSLADO')},{ Id:'3', Nombre: $translate.instant('ANULACION')}];


            self.gridOptionsapropiacion = {
                    enableSorting: true,
                    enableFiltering : true,
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,

                    columnDefs: [
                      { displayName:$translate.instant('CODIGO'), field: 'Rubro.Codigo',width: '50%' },
                      { displayName:$translate.instant('RUBRO'), field: 'Rubro.Descripcion' ,width: '50%'}
                    ]
                  };

                  self.select_id={};

                  self.gridOptionsapropiacion.onRegisterApi = function(gridApi){
                      self.gridApi = gridApi;
                      gridApi.selection.on.rowSelectionChanged($scope,function(row){
                      self.select_id=row.entity;
                      self.comprobarRubro(row.entity);
                      console.log(self.select_id);
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

                  self.comprobarRubro = function(apropiacion){
                    var repetido=true;
                    for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){
                      console.log(self.rubros_seleccionados[i].Id);
                      if((self.rubros_seleccionados[i].Id) == apropiacion.Rubro.Id){
                        repetido=false;
                      }
                    }
                    if(repetido==true){

                    self.rubros_seleccionados.push(self.select_id.Rubro);
                    var data={
                      Apropiacion: apropiacion.Id,
                      Rubro: apropiacion.Rubro.Id,
                      ValorTotal: 0,
                      Valor: "",
                      Dependencia: "",
                      NomDependencia: ""
                    }

                    self.rubros_seleccionados[self.rubros_seleccionados.length-1].seleccionado=[];
                    self.rubros_seleccionados[self.rubros_seleccionados.length-1].seleccionado.push(data);
                    }
                  };

                  self.mostrar_rubros = function(){
                    console.log(self.modificar_fuente)
                    console.log("prueba "+ self.modificar_fuente)

                    self.rubros_seleccionados=[];

                    for (var i = 0 ; i < self.fuente_financiacion_apropiacion.length ; i++){
                      self.codigo_rubro=self.fuente_financiacion_apropiacion[i].Apropiacion.Rubro;

                      if(self.fuente_financiacion_apropiacion[i].Fuente.Id == self.modificar_fuente){

                      var repetido=false;

                        for (var j = 0; j < self.rubros_seleccionados.length; j++) {
                              if(self.rubros_seleccionados[j].Codigo==self.codigo_rubro.Codigo){
                                repetido=true;
                              }
                        }
                        if(!repetido){
                        self.rubros_seleccionados.push(self.codigo_rubro);

                        self.rubros_seleccionados[self.rubros_seleccionados.length-1].seleccionado=[];
                      }
                      }
                    }


                    for (var i = 0; i < self.rubros_seleccionados.length; i++) {
                      for (var j = 0; j < self.fuente_financiacion_apropiacion.length; j++) {
                          if(self.fuente_financiacion_apropiacion[j].Fuente.Id == self.modificar_fuente && self.rubros_seleccionados[i].Id==self.fuente_financiacion_apropiacion[j].Apropiacion.Rubro.Id){
                          self.agregar_dependencia(self.rubros_seleccionados[i].Id,self.fuente_financiacion_apropiacion[j].Dependencia,self.fuente_financiacion_apropiacion[j].Valor,self.fuente_financiacion_apropiacion[j].Apropiacion.Id);
                        }
                      }
                    }
                  };

                  self.agregar_dependencia = function(id,dependencia,valor,apropiacion){

                    for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){

                      if(self.rubros_seleccionados[i].Id == id){
                        self.rep=true;

                        var data={
                          Apropiacion: apropiacion,
                          Rubro: id,
                          ValorTotal: valor,
                          Valor: "",
                          Dependencia: dependencia,
                          NomDependencia: ""
                        }
                        for (var j = 0; j < self.rubros_seleccionados[i].seleccionado.length; j++) {
                          if(dependencia==self.rubros_seleccionados[i].seleccionado[j].Dependencia){
                            self.rep=false;
                            self.rubros_seleccionados[i].seleccionado[j].ValorTotal=valor+self.rubros_seleccionados[i].seleccionado[j].ValorTotal;
                          }
                        }
                        if (self.rep) {
                            self.rubros_seleccionados[i].seleccionado.push(data);
                        }

                      }
                    }
                    console.log(self.rubros_seleccionados)
                  };

                  self.agregar_dep = function(id){

                    for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){

                      if(self.rubros_seleccionados[i].Id == id){

                        self.apropiacio_id=self.rubros_seleccionados[i].seleccionado[0].Apropiacion;


                        var data={
                          Apropiacion: self.apropiacio_id,
                          Rubro: id,
                          ValorTotal: 0,
                          Valor: "",
                          Dependencia: "",
                          NomDependencia: ""
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

self.montoAsignado=function(){

  self.totalMonto=0;
  for (var i = 0; i < self.rubros_seleccionados.length; i++) {
    for (var j = 0; j  < self.rubros_seleccionados[i].seleccionado.length; j++) {
      for (var k = 0; k < self.dependencia.length; k++) {
        if(self.rubros_seleccionados[i].seleccionado[j].Dependencia==self.dependencia[k].Id){
          self.rubros_seleccionados[i].seleccionado[j].NomDependencia=self.dependencia[k].Nombre;
        }
      }
      self.totalMonto=self.totalMonto+parseInt(self.rubros_seleccionados[i].seleccionado[j].Valor);
      console.log(self.totalMonto);
    }
  }
  console.log(self.totalMonto);
  if(self.totalMonto == self.nueva_fuente_apropiacion.Monto){
      console.log("si");
    return true;
  }else{
      console.log("no");
    return false;
  }
};
self.Codigo="1";
self.Sigla="d";
self.Descripcion="d";

self.comprobar_fuente=function(){

  self.registrar=true;

  if (self.modificar_fuente==null) {
    swal( $translate.instant('SELECCIONE_FUENTE_FINANCIAMIENTO'), "error");
  }
  else if(self.nueva_fuente_apropiacion.Monto==null){
    swal($translate.instant('INGRESE_VALOR_TOTAL'), "error");
  }
  else if(self.nueva_fuente_apropiacion.Fechainicio==null){
    swal($translate.instant('ERROR'), $translate.instant('INGRESAR_FECHA_CREACION'), "error");
  }else if(self.rubros_seleccionados.length==0){
      swal($translate.instant('ERROR'), $translate.instant('SELECCIONE_RUBROS_FUENTE'), "error");
  }else{


    for (var i = 0; i < self.rubros_seleccionados.length; i++) {
      for (var j = 0; j  < self.rubros_seleccionados[i].seleccionado.length; j++) {
        if (self.rubros_seleccionados[i].seleccionado[j].Valor==0) {
            swal($translate.instant('ERROR'), $translate.instant('INGRESE_VALOR_DEPENDENCIA'), "error");
            self.registrar=false;
        }
        else if (self.rubros_seleccionados[i].seleccionado[j].Dependencia==0) {
            swal($translate.instant('ERROR'), $translate.instant('INGRESE_DEPENDENCIA'), "error");
            self.registrar=false;
        }
      }
    }
    if (self.registrar) {
    if(self.montoAsignado()){
      $("#myModal").modal();
    }else{
    swal($translate.instant('ERROR'),$translate.instant('MONTO_MAYOR_FUENTE_FINANCIAMIENTO'), "error");
    }
    }
  }
  for (var i = 0; i < self.fuente_financiacion.length; i++) {
    console.log(self.fuente_financiacion[i].Id+" "+self.modificar_fuente)
    if(self.fuente_financiacion[i].Id==self.modificar_fuente){
      self.Codigo=self.fuente_financiacion[i].Codigo;
      self.Sigla=self.fuente_financiacion[i].Sigla;
      self.Descripcion=self.fuente_financiacion[i].Descripcion;
      console.log(self.nueva_fuente)

    }
  }
};

    self.cerrar_ventana= function(){
      $("#myModal").modal('hide');
    };


self.crear_fuente= function(){

  for (var i = 0; i < self.fuente_financiacion.length; i++) {
    if (self.fuente_financiacion[i].Id==self.modificar_fuente) {
      self.asignar_rubros(self.fuente_financiacion[i].Id);
      self.fente_encontrada=true;
      swal($translate.instant('PROCESO_COMPLETADO'),$translate.instant('REGISTRO_CORRECTO'), "success");
      $window.location.href = '#/fuente_financiacion/consulta_fuente';
    }
  }

};

self.asignar_rubros= function(id){

  for (var i = 0 ; i < self.rubros_seleccionados.length ; i++){
    console.log("rubro");
    console.log(id);
    console.log(self.rubros_seleccionados[i].seleccionado);

    for (var j = 0; j  < self.rubros_seleccionados[i].seleccionado.length; j++) {
      self.crear_fuente_apropiacion(id,self.rubros_seleccionados[i].seleccionado[j].Apropiacion, self.rubros_seleccionados[i].seleccionado[j].Dependencia,self.rubros_seleccionados[i].seleccionado[j].Valor,self.rubros_seleccionados[i].seleccionado[j].ValorTotal);
    }
  }
};


self.crear_fuente_apropiacion= function(fuente,apropiacion,dependencia,valor,valortotal){

  var data={

    Valor: parseInt(valor+valortotal),
    FechaCreacion: self.nueva_fuente_apropiacion.Fechainicio,
    Dependencia: parseInt(dependencia),
    Apropiacion: {
        Id: parseInt(apropiacion)
    },
    Fuente: {
        Id: parseInt(fuente)
    }
  }
  console.log(data);

  if(valortotal==0){
    financieraRequest.post("fuente_financiacion_apropiacion",data).then(function(response){
       self.fuente_financiacion_apropiacion.push(response.data);
       console.log(response.data);
    });
  }else{

    var data={

      Valor: parseInt(valor+valortotal),
      FechaCreacion: self.nueva_fuente_apropiacion.Fechainicio,
      Dependencia: parseInt(dependencia),
      Apropiacion: {
          Id: parseInt(apropiacion)
      },
      Fuente: {
          Id: parseInt(fuente)
      }
    }
    financieraRequest.post("fuente_financiacion_apropiacion",data).then(function(response){
       self.fuente_financiacion_apropiacion.push(response.data);
       console.log(response.data);
    });


  }

};

        $timeout(function() {
            $('.selectpicker').selectpicker('refresh');
            $('.selectpicker').selectpicker('render');
        });
        self.actualizar= function(){
          $('.selectpicker').selectpicker('refresh');
        };


});
