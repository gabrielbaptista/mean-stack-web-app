(function () {
    'use strict';

    angular
        .module('app')
        .controller('Stock.IndexController', Controller);

    function Controller($window, StockService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.contents = null;
        vm._contentsOld = [];
        vm.newRow = new Object();
        vm.newDate = new Date();
        vm.updateQueue = updateQueue;
        vm.deleteStock = deleteStock;
        vm.createStock = createStock;
        vm.test = test;
        vm._queue = {};

        initUser();

        function initUser() {
            // get current user data in the API
            StockService.GetUserId().then(function (userId) {
                StockService.GetCurrent(userId).then(function (user) {
                        vm.user = user;
                        resetNew();
                    });
            });
            updateTable();
            
        }
        
        function updateTable() {
            StockService.GetAll()
                .then(function(table) {
                    vm.contents = table;
                    for (let index in vm.contents) {
                        //vm.contents[index].marginPrice = vm.contents[index].purchasePrice;
                        var d = new Date(vm.contents[index].date.value);
                        console.log(vm.contents[index].date.value);
                        console.log(typeof(vm.contents[index].date.value));
                        vm.contents[index].date.value = d;
                        vm._contentsOld.push(_copy(vm.contents[index]));
                        vm._contentsOld[index].date.value = new Date(d);
                        console.log(vm._contentsOld[index].date.value);
                        console.log(vm.contents[index].date.value);
                        $(function(){$('[data-toggle="popover"]').popover()});
                    } 
                    //vm._contentsOld = _copy(table);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
        
        function _copy(src) {
            let target = {};
            for (let prop in src) {
                if (src.hasOwnProperty(prop)) {
                    if (typeof(src[prop]) === 'object' && !!src[prop]) {
                        target[prop] = _copy(src[prop]);
                    } else {
                        target[prop] = src[prop];
                    }
                }
            }
            return target;
        }
        
        function test() {
            console.log(vm.contents);
            console.log(vm._contentsOld);
        }
        
        function updateQueue(index, field) {
            var row = vm.contents[index];
            var item = null;
            console.log(row);
            console.log(vm._contentsOld[index]);
            console.log(field);
            if (field == 'date') {
                if (row[field].value.getTime() !== vm._contentsOld[index][field].value.getTime())  {
                   item = {value:new Date(row[field].value), mod:vm.user.username};
                }
            } else if (field == 'tagPrice' || field == 'purchasePrice' || field == 'suggestedPrice') {
                let val = parseFloat(row[field].value);
                console.log(val);
                if (val != vm._contentsOld[index][field].value) {
                    console.log("hey3");
                    if (isNaN(val)) {
                        FlashService.Error("Valor inconsistente em linha " + (index+1) + " no campo: " + field);
                    }
                     //vm._queue[row._id][field] = {value:val, mod:vm.user.username};
                    item = {value:val, mod:vm.user.username};
                }
            } else {
                if (!(row[field].value === vm._contentsOld[index][field].value)) {
                    item = {value:row[field].value, mod:vm.user.username};
                }
            }
            
            if (item != null) {
                let param = new Object();
                param[field] = item;
                StockService.Update(param, row._id)
                .then(function () {
                    vm._contentsOld[index][field] = _copy(item);
                    console.log(param);
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            }
            console.log(item);
            
        }
        
        function deleteStock(index) {
            StockService.Delete(vm.contents[index]._id)
            .then(function () {
                vm.contents.splice(index, index);
                vm._contentsOld.splice(index, index);
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
            console.log(vm._queue);
        }
        
        function createStock() {
            //vm.newRow.date.value = vm.newDate;
            StockService.Create(vm.newRow)
            .then(function () {
                //vm.contents.splice(index, index);
                //vm._contentsOld.splice(index, index);
                resetNew();
                updateTable();
            })
            .catch(function (error) {
                FlashService.Error(error);
            });
        }
        
        function resetNew() {
            let d = new Date();
            vm.newRow.code = {value: "", mod:vm.user.username};
            vm.newRow.date = {value: new Date(), mod:vm.user.username};
            vm.newRow.type = {value: "", mod:vm.user.username};
            vm.newRow.brand = {value: "", mod:vm.user.username};
            vm.newRow.char = {value: "", mod:vm.user.username};
            vm.newRow.size = {value: "", mod:vm.user.username};
            vm.newRow.color = {value: "", mod:vm.user.username};
            vm.newRow.tagPrice = {value: 0, mod:vm.user.username};
            vm.newRow.purchasePrice = {value: 0, mod:vm.user.username};
            vm.newRow.suggestedPrice = {value: 0, mod:vm.user.username};
        }
    }

})();
