'use strict';

describe('Controller: OrdenPagoOpProveedorUpdatePorIdCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoOpProveedorUpdatePorIdCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoOpProveedorUpdatePorIdCtrl = $controller('OrdenPagoOpProveedorUpdatePorIdCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoOpProveedorUpdatePorIdCtrl.awesomeThings.length).toBe(3);
  });
});
