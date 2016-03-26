var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var markdown = require( "markdown" ).markdown;

var _ =  require('underscore');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var MongoServer = mongodb.Server;

var mongoClient = new MongoClient(new MongoServer ('localhost', 27017));





app.use(express.static(__dirname));

app.get('/', function onReq(req, res) {

    res.writeHead(200, {
        'content-type': 'text/html'
    });

    res.write("Hello to my blog");
    res.end();
});

app.get('/post', function onReq(req, res) {

    res.writeHead(200, {
        'content-type': 'text/html'
    });

    MongoClient.connect("mongodb://localhost:27017/academy", function(err, db) {
        if(err) { return console.dir(err); }

        var collection = db.collection('posts');


        var titleString = req.param('title');
        var contentString = req.param('content');
        var post = {title: titleString, content:contentString};

        collection.insert(post, function(err){});
    });

    res.write(markdown.toHTML(req.param('content')));
    res.end();
});

app.get('/all', function onReq(req, res) {
    MongoClient.connect("mongodb://localhost:27017/academy", function(err, db) {
        if (err) {
            return console.dir(err);
        }
        var collection = db.collection('posts');
        collection.find().toArray(function(err, items) {
            res.writeHead(200, {
                'content-type': 'text/html'
            });

            res.write ("Here are your " + items.length + " posts");

            for(i = 0; i < items.length; i++) {
                post = items[i]
                res.write("<h2>" + post.title + "</h2>" + post.content.substr(0, 100) + "<br><br><br><br>");
            }

            res.write("That's all.");
            res.end();


        });



    });
});

app.get('/getAll', function onReq(req, res) {
    MongoClient.connect("mongodb://localhost:27017/academy", function(err, db) {
        if (err) {

            return console.dir(err);
        }
        var collection = db.collection('posts');
        collection.find().toArray(function(err, items) {
            res.writeHead(200, {
                'content-type': 'text/json'
            });

            res.write (JSON.stringify(items));
            res.end();
        });
    });
});


function getPost(title, callback) {
    MongoClient.connect("mongodb://localhost:27017/academy", function(err, db) {
        if(err) { return console.dir(err); }

        var collection = db.collection('posts');

        collection.findOne({title:title}, callback);
    });
}

app.get('/getPost', function onReq(req, res) {
    getPost(req.param('id'), function(err, item) {
        if (!!item) {
            res.writeHead(200, {
                'content-type': 'text/json'
            });

            //item.content = markdown.toHTML(item.content);
            res.write(JSON.stringify(item));
            res.end();
        } else {
            res.writeHead(404, {
                'content-type': 'text/html'
            });

            res.write("Not found :(");
            res.end();
        }
    });
});



app.get('*', function(req, res) {

    var firstPart = req.path.split('/') [1];

    getPost(firstPart, function(err, item) {
        if (!!item) {
            res.writeHead(200, {
                'content-type': 'text/html'
            });

            res.write("<h1>" + item.title + "</h1>");
            res.write(markdown.toHTML(item.content));
            res.end();
        } else {
            res.writeHead(404, {
                'content-type': 'text/html'
            });

            res.write("Not found :(");
            res.end();
        }
    });

    //MongoClient.connect("mongodb://localhost:27017/academy", function(err, db) {
    //    if(err) { return console.dir(err); }
    //
    //    var collection = db.collection('posts');
    //
    //    collection.findOne({title:firstPart}, function(err, item) {
    //        console.log(err);
    //        if (!!item) {
    //            res.writeHead(200, {
    //                'content-type': 'text/html'
    //            });
    //
    //            res.write("<h1>"+item.title+"</h1>");
    //            res.write(markdown.toHTML(item.content));
    //            res.end();
    //        } else {
    //            res.writeHead(404, {
    //                'content-type': 'text/html'
    //            });
    //
    //            res.write("Not found :(");
    //            res.end();
    //        }
    //    });
    //});
});

app.listen(8080);

console.log("started...");
