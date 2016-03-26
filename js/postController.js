angular.module('blog', ['ngSanitize'])
    .controller('PostController', function($http) {
        var PostController = this;
        PostController.model = {};
        PostController.model.title = "Marin's blog";




        function getQueryParams(qs) {
            qs = qs.split('+').join(' ');

            var params = {},
                tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        }

        var id = getQueryParams(document.location.search)['t'];
        $http.get("/getPost?id="+id).then(function(res) {
            console.log(res.data);
            PostController.model.title = res.data.title;
            PostController.model.content = markdown.toHTML(res.data.content);
        }, null);
    });