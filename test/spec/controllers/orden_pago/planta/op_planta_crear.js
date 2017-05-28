'use strict';

describe('Controller: OrdenPagoPlantaOpPlantaCrearCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoPlantaOpPlantaCrearCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoPlantaOpPlantaCrearCtrl = $controller('OrdenPagoPlantaOpPlantaCrearCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoPlantaOpPlantaCrearCtrl.awesomeThings.length).toBe(3);
  });
});
