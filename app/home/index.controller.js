(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;

        vm.user = null;

        initUser();

        function initUser() {
            // get current user data in the API
            UserService.GetUserId().then(function (userId) {
                UserService.GetCurrent(userId).then(function (user) {
                        vm.user = user;
                    });
            });
        }
    }

})();