'use strict';

describe('Controller: FuenteFinanciacionModificacionFuenteCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var FuenteFinanciacionModificacionFuenteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FuenteFinanciacionModificacionFuenteCtrl = $controller('FuenteFinanciacionModificacionFuenteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FuenteFinanciacionModificacionFuenteCtrl.awesomeThings.length).toBe(3);
  });
});
