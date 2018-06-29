'use strict';

describe('Controller: HomologacionRubroCrearCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var HomologacionRubroCrearCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomologacionRubroCrearCtrl = $controller('HomologacionRubroCrearCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HomologacionRubroCrearCtrl.awesomeThings.length).toBe(3);
  });
});
