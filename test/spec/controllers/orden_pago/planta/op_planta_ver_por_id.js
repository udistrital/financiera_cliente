'use strict';

describe('Controller: OrdenPagoPlantaOpPlantaVerPorIdCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoPlantaOpPlantaVerPorIdCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoPlantaOpPlantaVerPorIdCtrl = $controller('OrdenPagoPlantaOpPlantaVerPorIdCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoPlantaOpPlantaVerPorIdCtrl.awesomeThings.length).toBe(3);
  });
});
