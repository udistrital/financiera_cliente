'use strict';

describe('Controller: TesoreriaAvancesSolicitudGestionLegalizacionCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesSolicitudGestionLegalizacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesSolicitudGestionLegalizacionCtrl = $controller('TesoreriaAvancesSolicitudGestionLegalizacionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesSolicitudGestionLegalizacionCtrl.awesomeThings.length).toBe(3);
  });
});
