/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var menuOpen = false;
var menuDiv = "";
var locationTimer = 0;
var enableLocation = false;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', app.backPressed, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent();
    },
    // Update DOM on a Received Event
    receivedEvent: function() {
        cordova.plugins.notification.badge.hasPermission(function (granted) {
            if (granted===false) {
                cordova.plugins.notification.badge.registerPermission(function (granted) {
                });
            }
        });   
        cordova.plugins.notification.badge.configure({ autoClear: true });
        app.getLocation();
        app.runOnBackground();
        
        enableLocation = app.getSaveData("enableLocation");
        enableLocation = enableLocation.split(",");
        enableLocation = enableLocation[1];
        enableLocation = (enableLocation==="true");
        
        locationTimer = app.getSaveData("locationTimer");
        locationTimer = locationTimer.split(",");
        locationTimer = locationTimer[1];
        if (locationTimer!=="") {
            locationTimer = parseInt(locationTimer)*60000;   
        }
        
        //app.loadJSON(link);
        //app.notification();

        //set visible elements on main screen
        //var defaultScreen = document.getElementById("defaultScreen");
        //var option = document.getElementById("options");
        //var data = app.getInfo();
        //defaultScreen.setAttribute("style", "display:inline-block;");
    },

    backPressed: function(){
        window.history.back();
    },

    //checking connection
    checkConnection: function () {
        //localStorage.setItem("lastApprovalNumber", 8);
        if (localStorage.getItem("debug")!==""){
            localStorage.removeItem("debug");
        }
        
        var dataStored;
        for (var i = 0; i < localStorage.length; i++){
            dataStored += "Key: " + localStorage.key(i) + ", Value: " + localStorage.getItem(localStorage.key(i)) + "\n";
        }
        console.log("Stored Data: \n" + dataStored);
        console.log("JW: " + Base64.decode("V2VsY29tZTE"));
        console.log("Pass: " + Base64.encode("123456Aa"));

        var networkState = navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
        if (networkState=="No network connection") {
            app.showAlert("You are off-line. Please turn on network for getting notification.", "Connection", 0);
        }
    },

    //exit from app
    exitFromApp: function ()
    {
        navigator.notification.confirm(
            "Do you want to exit the app?", 
            function (button) {
              if (button==2) {
                navigator.app.exitApp();
              }
            },"EXIT",["Cancel","OK"]
        );
    },

    showAlert: function (message, title, duration) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
            if (duration > 0){
                navigator.notification.vibrate(duration);
            }
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    saveInfo: function (key, value, enableLocation, locationTimer) {
        console.log("Save Data with key: " + key + " and value: " + value);
        for (var i = 0; i < localStorage.length; i++){
            //alert(localStorage.key(i));
            if ((localStorage.key(i)!=key) && (localStorage.key(i)!="lastApprovalNumber") && (localStorage.key(i)!="enableLocation") && (localStorage.key(i)!="locationTimer")){
                localStorage.removeItem(key);
            }
        }
        localStorage.setItem(key, value);
        console.log(enableLocation + ", " + locationTimer);
        localStorage.setItem("enableLocation", enableLocation);
        localStorage.setItem("locationTimer", locationTimer);
        app.showAlert("Data was saved", "Save", 0);
    },

    getSaveData: function(key){
        console.log("Get Save Data with key: " + key);
        var data;
        var value = localStorage.getItem(key);
        if (value!==null){
            data = key.concat(",",value); 
            console.log("Data: " + data);
            return data;
        }else{
            return null;
        }
    },

    getLoginInfo: function () {
        console.log("Get Login Information");

        var dataStored;
        var enableLoc = false;
        var locTimer = 0;
        for (var i = 0; i < localStorage.length; i++){
            var key = localStorage.key(i);
            if (key=="enableLocation"){
                enableLoc = localStorage.getItem(key);             
                enableLoc = (enableLoc=="true");
            }
            if (key=="locationTimer"){
                locTimer = localStorage.getItem(key);
                locTimer = parseInt(locTimer);
            }
            dataStored += "Key: " + localStorage.key(i) + ", Value: " + localStorage.getItem(localStorage.key(i)) + "\n";
        }

        console.log("Stored Data: \n" + dataStored);
        console.log(enableLoc);
        console.log(locTimer);
        
        var data;
        if (localStorage.getItem("debug")!==""){
            localStorage.removeItem("debug");
        }
        if (localStorage.length > 0){
            username = document.getElementById("username");
            password = document.getElementById("password");
            var key = localStorage.key(localStorage.length - 1);
            var index = 2;
            while (key=="lastApprovalNumber" || key=="enableLocation" || key=="locationTimer"){
                key = localStorage.key(localStorage.length - index);
                index++;
            }
            var value = localStorage.getItem(key);
            if (value!==""){
                username.value = key;
                password.value = value;
                if (enableLoc===true){
                    document.getElementById("location-toggle").className="toggle active";
                    document.getElementById("location-timer").removeAttribute("disabled");
                    var attr = document.createAttribute("enable");
                    document.getElementById("location-timer").setAttributeNode(attr);
                }
                if (locTimer!==0 && locTimer!==""){
                    document.getElementById("location-timer").value = locTimer;
                }
                data = key.concat(",",value);
            }
        }
        console.log("Data: " + data);
    },

    clearData: function(){
        //localStorage.clear();
        navigator.notification.confirm(
            "Do you want to clear all login data from the app?", 
            function (button) {
              if (button==2) {
                localStorage.clear();
                username = document.getElementById("username");
                password = document.getElementById("password");
                username.value = "";
                password.value = "";
                app.showAlert("All saved data was cleared", "Clear data", 0);
              }
            },"Clear Data",["Cancel","OK"]
        );
    },

    notification:function(total, isEnable){
        console.log("notification");
        if (isEnable===true){
            cordova.plugins.notification.local.hasPermission(function (granted) {
                if (granted===false) {
                    cordova.plugins.notification.local.registerPermission(function (granted) {
                    });
                }
            });

            cordova.plugins.notification.local.schedule({
                id: 1,
                title: 'WorkflowFirst Tracker',
                text: 'You have ' + total + ' new To-Do items',
                icon: 'res://icon'
            });
            cordova.plugins.notification.badge.set(total);
        }
    },

    runOnBackground:function(){  
        // Android customization
        cordova.plugins.backgroundMode.setDefaults({ 
            text:'Do not exit the app from recent/multitasking menu to get notification.',
            title: 'WorkflowFirst Tracker'
        });

        // Enable background mode
        cordova.plugins.backgroundMode.enable();

        // Called when background mode has been activated
        cordova.plugins.backgroundMode.onactivate = function () {
            var tasks = setInterval(function () {
                app.callLoadJSON();
            }, 60000);

            if (locationTimer!==""){
                var location = setInterval(function () {
                    app.getLocation();
                }, locationTimer);
            }else{
                var location = setInterval(function () {
                    app.getLocation();
                }, 300000);
            }
        }

        // Get informed when the background mode has been deactivated
        cordova.plugins.backgroundMode.ondeactivate = function () {
            clearInterval(task);
            clearInterval(location);
            cordova.plugins.notification.badge.clear();
            if (locationTimer!==""){
                var locationForceground = setInterval(function () {
                    app.getLocation();
                }, locationTimer);
            }else{
                var locationForceground = setInterval(function () {
                    app.getLocation();
                }, 300000);
            }
        };
    },

    //checking new To-Do from server
    callLoadJSON:function(){
        //alert("callLoadJSON");
        //alert("Local Storage Length: " + localStorage.length);
        if (localStorage.length > 0){
            //getting user's credentials
            var key = localStorage.key(localStorage.length - 1);
            var index = 2;
            while (key=="lastApprovalNumber"){
                key = localStorage.key(localStorage.length - index);
                index++;
            }
            var data = app.getSaveData(key);
            data = data.split(",");
            var username = data[0];
            var password = data[1];

            //alert(username + ", " + password);

            var approvalNumber = [];

            var lastApprovalNumber = app.getSaveData("lastApprovalNumber");
            var link = "http://demo.workflowfirst.net/apiget.aspx?path=";
            if (lastApprovalNumber!==null){
                lastApprovalNumber = lastApprovalNumber.split(',');
                lastApprovalNumber = lastApprovalNumber[1];
                link += "%2FApproval%5BStatus%3D%22Pending%22%2C%20ApprovalNumber%3E" + lastApprovalNumber + "%5D";
            }else{
                link += "%2FApproval%5BStatus%3D%22Pending%22%5D";
            }

            if (username!=="" && password!=="" && username!=="lastApprovalNumber"){
                link += "&USERNAME=" + username;
                link += "&PASSWORD=" + Base64.encode(password);
                link += "&format=json";

                //alert("Link: " + link);

                $.ajax({
                     url:link,
                     dataType: 'jsonp',
                     success:function(json){
                        for (var i in json.response) {
                            console.log("Putting data to array");
                            approvalNumber.push(json.response[i].ApprovalNumber);
                        }
                        if (approvalNumber.length > 0){
                            approvalNumber = approvalNumber.sort(function(a, b){return b-a});
                            localStorage.setItem("lastApprovalNumber", approvalNumber[0]);
                            //alert("Largest Approval Number: " + approvalNumber[0]);
                            app.notification(approvalNumber.length, true);
                        }
                     },
                     error:function(){
                         console.log("Error with retrieving data from server");
                     }      
                });
            }else{
                console.log("Error with retrieving data from server. No login information found");
            }
        }else{
            console.log("Error with retrieving data from server. No login information found");
        }
    },

    //getting location and related information
    getLocation: function(){
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError, {enableHighAccuracy: true });
    },

    onSuccess: function(position) {
        console.log('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + app.timeConverter(position.timestamp)                + '\n');

        var anchor = document.getElementById("locationAnchor"); 
        var att = document.createAttribute("href");
        var location = position.coords.latitude + "," + position.coords.longitude;

        var href = "http://maps.google.com/?q=" + location

        if (device.platform === 'Android') {
             href = "geo:" + location
        }
        if (device.platform === 'iOS') {
            href = "http://maps.apple.com/?q=" + location
        }

        att.value =  href;
        anchor.setAttributeNode(att);  
        return href;
    },

    setURL: function (){
        window.open(app.getLocation());
    },
    
    onError: function (error) {
        console.log('Location error code: '    + error.code    + '\n' +
              'Message: ' + error.message + '\n');
    },

    timeConverter: function (UNIX_timestamp){
      var d = new Date(UNIX_timestamp);
      return d.toString();
    }
};