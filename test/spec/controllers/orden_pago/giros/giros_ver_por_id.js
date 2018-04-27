'use strict';

describe('Controller: OrdenPagoGirosGirosVerPorIdCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var OrdenPagoGirosGirosVerPorIdCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenPagoGirosGirosVerPorIdCtrl = $controller('OrdenPagoGirosGirosVerPorIdCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdenPagoGirosGirosVerPorIdCtrl.awesomeThings.length).toBe(3);
  });
});
