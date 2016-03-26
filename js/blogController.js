angular.module('blog', [])
    .controller('BlogController', function($http) {
        var BlogController = this;
        BlogController.model = {};
        BlogController.model.title = "Marin's blog";
        BlogController.model.subtitle = "a place to share my thoughts on life having no meaning"

        $http.get("/getAll").then(function(res) {
            console.log(res);
            arr = res.data;
            for(var i = 0; i < arr.length; i++) {
                arr[i].content = arr[i].content.substr(0, 200);
            }
            BlogController.model.posts = arr;
        }, null);

    });