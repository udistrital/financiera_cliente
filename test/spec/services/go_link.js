'use strict';

describe('Service: goLink', function () {

  // load the service's module
  beforeEach(module('financieraClienteApp'));

  // instantiate service
  var goLink;
  beforeEach(inject(function (_goLink_) {
    goLink = _goLink_;
  }));

  it('should do something', function () {
    expect(!!goLink).toBe(true);
  });

});
