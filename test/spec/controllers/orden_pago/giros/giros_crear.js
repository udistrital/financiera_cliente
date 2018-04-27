'use strict';

describe('Controller: OrdenPagoGirosGirosCrearCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoGirosGirosCrearCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoGirosGirosCrearCtrl = $controller('OrdenPagoGirosGirosCrearCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoGirosGirosCrearCtrl.awesomeThings.length).toBe(3);
  });
});
