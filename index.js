var color = require("colorize"),
    _     = require("underscore")._,
    fs    = require("fs"),
    path  = require("path");

/*

restDocDir = appDir + "/public/feather-res-cache/_rest",
*/
module.exports = {

  /**
   *  Generates schema objects for each feather rest interface found.
   * 
   *  @param options available options: 
   *    restFolder: the folder to search for rest files in
   *    interface: the single file to generate a schema for.  If omitted, generates for all js files in the folder.
   *  @param cb      
   */
  generateSchemas: function(options, cb) {


    var restDir = options.restFolder,
        ifc = options.interface || "all",
        restFiles = getFiles(restDir);

    if (ifc !== "all") {
      if (! _.include(restFiles, restDir + '/' + ifc + ".js")) {
        cb(ifc + " interface not found.");
        return;
      } else {
        restFiles = [restDir + '/' + ifc + ".js"];
      }
    }

    console.log('Generating REST docs for ' + color.ansify("#bold[#cyan[" + ifc + "]]") + " interface(s).");

    // Ensure the directory tree is created.
    // mkdirpSync(restDocDir);

    var schemas = [];

    _.each(restFiles, function(restFile) {

      var fileData = fs.readFileSync(restFile, 'UTF-8').split('\n');
      // Parse the file data
      //var fileObj = require(restFile);
      
      var schema = { 
        name: path.basename(restFile, '.js'),
        endpoints: []
      },
      buf = "",
      methodPtn = /^('|")(get|post|delete|put|head)('|"): \{/i,
      commentStartPtn = /^\/\*\{$/,
      commentEndPtn = /^\}\*\/$/,
      endpointPtn = /(('|")(\/.*)('|")): /,
      inSchemaComment = false,
      schemaComment = {},
      currMethod = "",
      tmp;

      _.each(fileData, function(line) {
        var l = line.trim();

        if (methodPtn.test(l)) {
          currMethod = l.match(methodPtn)[2];
        } else if (commentStartPtn.test(l)) {
          inSchemaComment = true;
          schemaComment = "{";
        } else if (commentEndPtn.test(l)) {
          inSchemaComment = false;
          schemaComment = JSON.parse(schemaComment+"}");
          
        } else if (!inSchemaComment && endpointPtn.test(l)) {
          tmp = l.match(endpointPtn)[3];
          schemaComment.uri = tmp;
          schemaComment.verb = currMethod;
          switch(currMethod) {
            case 'post': 
              schemaComment.verbLabel = 'success';
              break;
            case 'put': 
              schemaComment.verbLabel = 'warning';
              break;
            case 'delete': 
              schemaComment.verbLabel = 'important';
              break;
            default: 
              schemaComment.verbLabel = 'info';
              break;
          }
          schema.endpoints.push(schemaComment);
          schemaComment = {};

        } else if (inSchemaComment) {
          schemaComment += l;
        }
      });
      schemas.push(schema);
    });
    cb(null, schemas);
  }
};

function getFiles(dir){
    var files = [];
    debugger;
    try {
        fs.statSync(dir);
    } catch (ex){
        return [];
    }

    function traverse(dir, stack){
        console.log("Traversing " + dir);
        stack.push(dir);
        fs.readdirSync(stack.join("/")).forEach(function(file){
          debugger;
            var path = stack.concat([file]).join("/");
            var stat = fs.statSync(path);
            
            if (file[0] == ".") {
                return;
            } else if (stat.isFile() && /\.js$/.test(file)){
                files.push(path);
            } else if (stat.isDirectory()){
                traverse(file, stack);
            }
        });
        stack.pop();
    }
    
    traverse(dir, []);

    return files;
}