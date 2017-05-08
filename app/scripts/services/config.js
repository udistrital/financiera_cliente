'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.config
 * @description
 * # config
 * Constant in the financieraClienteApp.
 */

var host = 'http://10.20.0.184:8088';
var host_sicapital = 'http://10.20.0.184';


angular.module('financieraClienteApp')
  .constant('CONF', {
      HOST:host,
      HOST_SICAPITAL: host_sicapital,
      HOST_SOLICITUD_AVANCE: host+'/tesoreria/solicitudavance',
      HOST_TIPO_AVANCE: host+ '/tesoreria/tipoavance',
      HOST_SERVICE_SIC: host_sicapital+'/sicws/ws/sicapitalAPI.php/?',
      POST_CODE: 200,
      HOST_LEGALIZAR_AVANCE : host+'/tesoreria/legalizaravance'
  });
