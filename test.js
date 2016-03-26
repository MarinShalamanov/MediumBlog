var fs = require('fs');
var http = require('http');


var _ =  require('underscore');


var webshot = require('webshot');

console.log("start");
webshot('<html><body>Hello World <img width="20px" height="20px" src="https://changelog.com/wp-content/themes/thechangelog-theme/assets/images/the-changelog.svg" alt="t" /></body></html>', 'hello_world.png', {siteType:'html'}, function(err) {

    // screenshot now saved to hello_world.png
    console.log("done ", err);
});





