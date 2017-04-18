var chai = require('chai');
var should = chai.should();
var api = require('../api-functions');


describe('checks checkShootingExists from api-functions', function(){
  
  it('should check if shooting with id exists (1-7)', function(){
    for (var i = 1;i<=7; i++){
      api.checkShootingExists(i).should.be.true;
    }
  });

  it('should be false with no parameter', function(){
    api.checkShootingExists().should.be.false;
  });

  it('should be false with a string as parameter', function(){
    api.checkShootingExists('string').should.be.false;
  });

});

describe('checks nextFreeId from api-functions', function(){

  it('should be 8 with current testing data', function(){
    api.nextFreeId().should.be.equal(8);
  });

});

