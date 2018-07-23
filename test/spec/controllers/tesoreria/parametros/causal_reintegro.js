'use strict';

describe('Controller: TesoreriaParametrosCausalReintegroCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var TesoreriaParametrosCausalReintegroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TesoreriaParametrosCausalReintegroCtrl = $controller('TesoreriaParametrosCausalReintegroCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TesoreriaParametrosCausalReintegroCtrl.awesomeThings.length).toBe(3);
  });
});
