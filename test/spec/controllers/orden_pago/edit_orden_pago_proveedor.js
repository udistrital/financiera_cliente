'use strict';

describe('Controller: OrdenPagoEditOrdenPagoProveedorCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoEditOrdenPagoProveedorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoEditOrdenPagoProveedorCtrl = $controller('OrdenPagoEditOrdenPagoProveedorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoEditOrdenPagoProveedorCtrl.awesomeThings.length).toBe(3);
  });
});
