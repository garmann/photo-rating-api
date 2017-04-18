var fs = require('fs');
var request = require('supertest');
describe('supertest: loading express', function () {

  var server;

  beforeEach(function () {
    server = require('../app');
  });

  afterEach(function () {
    server.close();
  });


  it('(GET /listing-overview) should check has json content', function testListingOverview(done) {
  request(server)
    .get('/listing-overview')
    .expect(200)
    .expect(function(res){
      if (!JSON.parse(res.text).listings){
        throw new Error('could not find "listings" key in json data');
      }
    })
    .expect(200, done)
  });


  it('(GET /listing/1) should check for first shooting has json content and title', function testFirstShooting(done){
    request(server)
      .get('/listing/1')
      .expect(200)
      .expect(function(res){
        if (!JSON.parse(res.text).shooting.title){
          throw new Error('could not find "title" key in json data');
        }
      })
      .expect(200, done)
  });

  it('FAIL (GET /listing/11111111) should return 404', function testGetNonExistingShooting(done){
    request(server)
      .get('/listing/11111111')
      .expect(404, done)
  });


  // need to grab id for a later test, see below...
  var getIdFromTestCreateShootingForLater = '';

  it('(POST /listing) should create a shooting', function testCreateNewShooting(done){

    var jsondata = JSON.parse(fs.readFileSync('json/listing-details-1.json'));

    request(server)
      .post('/listing')
      .type('json')
      .send(jsondata)
      .expect(201)
      .expect(function(res){
        getIdFromTestCreateShootingForLater = parseInt(res.text.split(" ").slice(-1));
      })
      .expect(201, done)

  });

  // this test needs code from above: getIdFromTestCreateShootingForLater
  it('(PUT /listing/"id") should update current shooting', function testUploadShooting(done){

    var jsondata = JSON.parse(fs.readFileSync('json/listing-details-1.json'));

    request(server)
      .put('/listing/' + getIdFromTestCreateShootingForLater)
      .type('json')
      .send(jsondata)
      .expect(201, 'json updated')
      .expect(201, done)
  });

  // this test needs code from above: getIdFromTestCreateShootingForLater
  it('(DELETE /listing/"id") should remove the shooting from previous test', function testDeleteShooting(done){

    if(Number.isInteger(getIdFromTestCreateShootingForLater)){
      request(server)
        .delete('/listing/' + getIdFromTestCreateShootingForLater)

        .expect(201)
        .expect(function(res){
          if(res.text !== getIdFromTestCreateShootingForLater + 'deleted'){
            throw new Error("error with deleting shooting: " + getIdFromTestCreateShootingForLater);
          }
        })
        .expect(201, done)
    }

  });

  it('FAIL (DELETE /listing/asd) should return 400', function(done){
    request(server)
      .delete('/listing/asd')
      .expect(400, done)
  });


  it('(GET /foo/bar) should create http 404 for everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });


  it('(GET /download-listing/1) should download a shooting', function testDownloadShooting(done){
    request(server)
      .get('/download-listing/1')
      .expect(200)
      .expect('Content-Type', 'application/zip')
      .expect('Content-Disposition', 'attachment; filename="shooting-1.zip"')
      .expect(200, done)
  });

});