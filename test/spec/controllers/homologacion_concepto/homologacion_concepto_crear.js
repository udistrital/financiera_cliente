'use strict';

describe('Controller: HomologacionConceptoHomologacionConceptoCrearCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var HomologacionConceptoHomologacionConceptoCrearCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HomologacionConceptoHomologacionConceptoCrearCtrl = $controller('HomologacionConceptoHomologacionConceptoCrearCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HomologacionConceptoHomologacionConceptoCrearCtrl.awesomeThings.length).toBe(3);
  });
});
