'use strict';

describe('Controller: OrdenPagoAddOrdenPagoProveedorCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoAddOrdenPagoProveedorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoAddOrdenPagoProveedorCtrl = $controller('OrdenPagoAddOrdenPagoProveedorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoAddOrdenPagoProveedorCtrl.awesomeThings.length).toBe(3);
  });
});
