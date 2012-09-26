var frd = require("../index");

describe('FeatherRestDescriptor', function() {

  describe('Schema Gen', function() {
    it('should generate a sample schema', function(done) {
      frd.generateSchemas({ restFolder: __dirname + "/rest" }, function(err, schemas) {
        console.log(JSON.stringify(schemas[0]));
        if (err) throw err;
        
        schemas.should.have.lengthOf(1);
        schemas[0].name.should.equal('rest-test');
        schemas[0].endpoints.should.have.lengthOf(2);
        schemas[0].endpoints[1].verb.should.equal('post');
        done();
      });
    });
  });
});