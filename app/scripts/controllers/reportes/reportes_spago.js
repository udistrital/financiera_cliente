'use strict';
'Sbi'
/**
* @ngdoc function
* @name financieraClienteApp.controller:ReportesReportesSpagoCtrl
* @description
* # ReportesReportesSpagoCtrl
* Controller of the financieraClienteApp
*/
angular.module('financieraClienteApp')
.controller('ReportesReportesSpagoCtrl', function () {

  var self = this;

  var sbi = Sbi.sdk;

  Sbi.sdk.services.setBaseUrl({
    protocol: 'https'
    , host: 'intelligentia.udistrital.edu.co'
    , port: '8443'
    , contextPath: 'SpagoBI'
    , controllerPath: 'servlet/AdapterHTTP'
  });


  function execTest() {
    var html = Sbi.sdk.api.getDocumentHtml({
      documentLabel: 'RteControlNomina',
      executionRole: '/spagobi/user/admin',
      displayToolbar: false
      , displaySliders: false,
      iframe: {
        id: 'frame-reporte',
        width: '100%',
        border: '0px',
        height: '500px;'
      }

    });
    console.log(html);
    $('#frame').append(html)

  }

  var cb = function (result, args, success) {
    if(success === true) {
      execTest();
    } else {
      alert('ERROR: Usuario o contraseña incorrectos');
    }
  }



  Sbi.sdk.api.authenticate({
    params: {
      user: 'cosultaArgo'
      , password: 'cosultaArgo'
    }
    , callback: {
      fn: cb
      , scope: this
      //, args: {arg1: 'A', arg2: 'B', ...}
    }
  });

});
