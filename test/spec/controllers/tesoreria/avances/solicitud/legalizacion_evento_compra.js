'use strict';

describe('Controller: TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl = $controller('TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesSolicitudLegalizacionEventoCompraCtrl.awesomeThings.length).toBe(3);
  });
});
