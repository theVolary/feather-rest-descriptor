module.exports = {

  'get': {

    /*{
      "nickname": "test",
      "description": "rest test endpoint",
      "notes": "These are some notes on the rest endpoint.",
      "parameters": {
        "qs": [
          { 
            "name" : "fakeParam", 
            "type" : "integer",
            "description": "This isn't a real parameter."
          },
          {
            "name" : "fakeParam2",
            "description" : "Neither is this one."
          }
        ]
      }
    }*/
    '/:wickedCoolEndpoint/': function(req, res, cb) {

      // Do some cool stuff.
    }
  },

  "post": {
    '/:updateSomeStuff': function(req, res, cb) {
      // Update something.
    }
  }
};