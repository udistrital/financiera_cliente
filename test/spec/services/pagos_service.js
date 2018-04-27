'use strict';

describe('Service: pagosService', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var pagosService;
  beforeEach(inject(function (_pagosService_) {
    pagosService = _pagosService_;
  }));

  it('should do something', function () {
    expect(!!pagosService).toBe(true);
  });

});
