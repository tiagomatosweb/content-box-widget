(function(){
    "use strict";

    if (typeof String.prototype.startsWith != "function") {
        String.prototype.startsWith = function(str) {
            return this.slice(0, str.length) == str;
        };
    }
    if (typeof String.prototype.endsWith != "function") {
        String.prototype.endsWith = function(str) {
            return this.slice(-str.length) == str;
        };
    }

    if (!window.Global) {
        window.Global = {}
    }
    if (!Global.angularDependencies) {
        Global.angularDependencies = ['ModWidget'];
    }


    //Myapp module
    angular.module('myapp', Global.angularDependencies);
    angular.module('myapp').config(['$interpolateProvider', function($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    }]);


    angular.module('myapp').controller('WidgetController', ['$scope', 'Widget', function($scope, Widget) {
        $scope.w = Widget;
    }]);


    /**
    * Widget module
    * It depends on ModAjax
    */
    angular.module('ModWidget', ['ModAjax'])
    angular.module('ModWidget').factory('Widget', ['Ajax', '$rootScope', '$sce', function(Ajax,  $rootScope, $sce) {
        var w = {
        	show: false,
        	error: false,
        	json: {},
        	itemSelected: {},
        	itemSelectedNextTitle: '',
        	length: ''
        };

        w.prev = function(item) {
        	var index = w.json.content.indexOf(item);
        	// console.log(w.json.content[index+1]);
        	if (index-1 in w.json.content) {
        		w.itemSelected = w.json.content[index-1];
        	} else {
        		w.itemSelected = w.json.content[w.json.content.length-1];
        	}
    		w.nextTitle('prev');
        }

        w.next = function(item) {
        	var index = w.json.content.indexOf(item);
        	if (index+1 in w.json.content) {
        		w.itemSelected = w.json.content[index+1];
        	} else {
        		w.itemSelected = w.json.content[0];
        	}
    		w.nextTitle('next');
        }

        w.nextTitle = function(direction) {
        	var nextTitle = w.json.content.indexOf(w.itemSelected);
    		if (nextTitle+1 in w.json.content) {
        		w.itemSelectedNextTitle = w.json.content[nextTitle+1].title;
        	} else {
        		w.itemSelectedNextTitle = w.json.content[0].title;

        	}
        }

        w.renderHtml = function(html_code) {
		    return $sce.trustAsHtml(html_code);
		}
        return w;
    }]);

    angular.module('ModWidget').directive('boxWidget', ['Ajax', function(Ajax) {
    	return {
    		restric: 'E',
    		replace: true,
    		templateUrl: 'template/widget.html',
    		link: function(scope, element, attrs) {
				Ajax.get('mock/content.json').success(function(data) {
					if (Object.keys(data).length) {
				    	scope.w.length = Object.keys(data).length;
				    	scope.w.show = true;
				    	scope.w.json = data;
				    	scope.w.itemSelected = data['content'][0];
				    	scope.w.itemSelectedNextTitle = data['content'][1].title;
					} else {
				    	scope.w.show = false;
				    	scope.w.error = true;
					}
			    });
			}
    	}
    }]);


    /**
    * Ajax module
    */
    angular.module('ModAjax', []);
    angular.module('ModAjax').factory('Ajax', ['$http', function($http) {
        return {
            get: function(url, params) {
                if (!params) {
                    params = {}
                }
                return $http({
                    method: 'GET',
                    url: url,
                    headers : {'Content-Type' : 'application/json; charset=UTF-8'},
                    params: params
                });
            },
            post: function(url, params) {
                if (!params) {
                    params = {}
                }
                return $http({
                    method: 'POST',
                    url: url,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(params)
                });
            }
        }
    }]);
})();