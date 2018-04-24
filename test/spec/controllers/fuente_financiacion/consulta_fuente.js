'use strict';

describe('Controller: FuenteFinanciacionConsultaFuenteCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var FuenteFinanciacionConsultaFuenteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FuenteFinanciacionConsultaFuenteCtrl = $controller('FuenteFinanciacionConsultaFuenteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FuenteFinanciacionConsultaFuenteCtrl.awesomeThings.length).toBe(3);
  });
});
