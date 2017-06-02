'use strict';

describe('Controller: OrdenPagoOpListarTodasUpdateCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoOpListarTodasUpdateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoOpListarTodasUpdateCtrl = $controller('OrdenPagoOpListarTodasUpdateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoOpListarTodasUpdateCtrl.awesomeThings.length).toBe(3);
  });
});
