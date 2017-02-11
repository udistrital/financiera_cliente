'use strict';

describe('Controller: OrdenPagoViewOrdenPagoProveedorCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoViewOrdenPagoProveedorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoViewOrdenPagoProveedorCtrl = $controller('OrdenPagoViewOrdenPagoProveedorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoViewOrdenPagoProveedorCtrl.awesomeThings.length).toBe(3);
  });
});
