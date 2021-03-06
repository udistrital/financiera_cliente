'use strict';

describe('Controller: TesoreriaAvancesSolicitudGestionSubtipoCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaAvancesSolicitudGestionSubtipoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaAvancesSolicitudGestionSubtipoCtrl = $controller('TesoreriaAvancesSolicitudGestionSubtipoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaAvancesSolicitudGestionSubtipoCtrl.awesomeThings.length).toBe(3);
  });
});
