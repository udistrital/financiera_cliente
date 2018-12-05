'use strict';

describe('Controller: TesoreriaAvancesSolicitudEvLegalizacionTipoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesSolicitudEvLegalizacionTipoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesSolicitudEvLegalizacionTipoCtrl = $controller('TesoreriaAvancesSolicitudEvLegalizacionTipoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesSolicitudEvLegalizacionTipoCtrl.awesomeThings.length).toBe(3);
  });
});
