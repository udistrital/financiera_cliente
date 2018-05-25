'use strict';

describe('Controller: DevolucionesParametrosRazonDevolucionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var DevolucionesParametrosRazonDevolucionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevolucionesParametrosRazonDevolucionCtrl = $controller('DevolucionesParametrosRazonDevolucionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DevolucionesParametrosRazonDevolucionCtrl.awesomeThings.length).toBe(3);
  });
});
