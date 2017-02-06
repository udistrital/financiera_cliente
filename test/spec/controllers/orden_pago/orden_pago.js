'use strict';

describe('Controller: OrdenPagoOrdenPagoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoOrdenPagoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoOrdenPagoCtrl = $controller('OrdenPagoOrdenPagoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoOrdenPagoCtrl.awesomeThings.length).toBe(3);
  });
});
