'use strict';

describe('Controller: ConceptosListadoConceptosCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var ConceptosListadoConceptosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConceptosListadoConceptosCtrl = $controller('ConceptosListadoConceptosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConceptosListadoConceptosCtrl.awesomeThings.length).toBe(3);
  });
});
