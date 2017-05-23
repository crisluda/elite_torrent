"use strict";angular.module("peerflixServerApp",["ngCookies","ngResource","ngSanitize","ngRoute","btford.socket-io","angularFileUpload"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]).run(function(){window.addEventListener("dragover",function(a){a.preventDefault()},!1),window.addEventListener("drop",function(a){a.preventDefault()},!1)}),angular.module("peerflixServerApp").controller("MainCtrl",["$scope","$resource","$log","$q","$upload","torrentSocket",function(a,b,c,d,e,f){function g(){var b=k.query(function(){a.torrents=b.reverse()})}function h(b){return k.get({infoHash:b}).$promise.then(function(c){var d=_.find(a.torrents,{infoHash:b});if(d){var e=a.torrents.indexOf(d);a.torrents[e]=c}else a.torrents.unshift(c);return c})}function i(b){var c=_.find(a.torrents,{infoHash:b});return c?d.when(c):h(b)}function j(a){Push.create("Your torrent has finished downloading!",{body:a.name+" has finished downloading.",icon:"images/a6651610.logo.png"})}var k=b("/torrents/:infoHash");g(),a.keypress=function(b){13===b.which&&a.download()},a.download=function(){a.link&&(k.save({link:a.link}).$promise.then(function(a){h(a.infoHash)}),a.link="")},a.upload=function(a){a&&a.length&&a.forEach(function(a){e.upload({url:"/upload",file:a}).then(function(a){h(a.data.infoHash)})})},a.pause=function(a){f.emit(a.stats.paused?"resume":"pause",a.infoHash)},a.select=function(a,b){f.emit(b.selected?"deselect":"select",a.infoHash,a.files.indexOf(b))},a.remove=function(b){k.remove({infoHash:b.infoHash}),_.remove(a.torrents,b)},f.on("verifying",function(a){i(a).then(function(a){a.ready=!1})}),f.on("ready",function(a){h(a)}),f.on("interested",function(a){i(a).then(function(a){a.interested=!0})}),f.on("uninterested",function(a){i(a).then(function(a){a.interested=!1})}),f.on("finished",function(a){i(a).then(j)}),f.on("stats",function(a,b){i(a).then(function(a){a.stats=b})}),f.on("download",function(a,b){i(a).then(function(a){a.progress=b})}),f.on("selection",function(a,b){i(a).then(function(a){if(a.files)for(var c=0;c<a.files.length;c++){var d=a.files[c];d.selected=b[c]}})}),f.on("destroyed",function(b){_.remove(a.torrents,{infoHash:b})}),f.on("disconnect",function(){a.torrents=[]}),f.on("connect",g)}]),angular.module("peerflixServerApp").factory("torrentSocket",["socketFactory",function(a){return a()}]);