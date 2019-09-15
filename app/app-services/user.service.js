(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var apiURL = "http://localhost:9050/api/users";
        var service = {};

        service.GetToken = GetToken;
        service.GetUserId = GetUserId;
        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        
        return service;

        function GetUserId() {
            // get userId token from server
            return $.get('/app/userId');
        }

        function GetToken() {
            // get userId token from server
            return $.get('/app/token');
        }

        function GetCurrent(userId) {
            return $http.get(apiURL + '/' + userId).then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get(apiURL).then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.getapiURL + (apiURL + '/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername(username) {
            return $http.get(apiURL + '/' + username).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post(apiURL, user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put(apiURL + '/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete(apiURL + '/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
        
    }

})();
