/*
*    EVENT Code
*/

// Enum htmlID
var htmlID = {
   leftPanel : "lstCapteurs",
   centerPanel : "control",
   listActiveDevice : "listActiveDevice",
   rightPanel : "lstDevices",
   devices : "devices",
   alertBox : "alertBox",

   lstCapteurs_body : "lstCapteurs_body",
   textLstDevices : "textLstDevices",
   JSONMsg : "msg",
   sampleRate : "sampleRate",

   dragZone : "dragZone"
}

// Enum Action
var Action = {
   logInfo : 0,
   setSampleRate : 1
}

// JQuery extention (getObj) : get a JQuery Object from the enum "htmlID"
$.extend({
   getObj: function (htmlID) {
      return $("#"+htmlID);
   }
});

// JQuery extention (diff) : get all diffirente element from a in b
$.extend({
    compare: function (arrayA, arrayB) {
        if (arrayA.length != arrayB.length) { return false; }
        var a = $.extend(true, [], arrayA);
        var b = $.extend(true, [], arrayB);

        if (typeof a[0] != "object") {
           a.sort(); 
           b.sort();

           for (var i = 0, l = a.length; i < l; i++) {
               if (a[i] !== b[i])
                   return false;
           }

           return true;
        } else {
           for (var i = 0, l = a.length; i < l; i++) {
               var isEgal = false;
               for (var ib = 0 ; ib < b.length ; ib++) {
                  if ($.equals(a[i],b[ib])) {
                     isEgal = true;
                     break;
                  }
               }
               if (!isEgal)
                  return false;
           }
           return true;
        }
    }
});

// JQuery extention (diff) : get all diffirente element from a in b
$.extend({
    diff: function (a, b) {
        var lst = [];

        for (var i = 0, l = a.length; i < l; i++) {
           if (typeof a[i] == "object")
              b.indexOf = indexOf;

           if (b.indexOf(a[i]) == -1)
              lst.push(a[i]);
        }

        return lst;
    }
});

// JQuery extention (equals) : check if 2 objects are the same
$.extend({
    equals : function (objA, objB) {
       var isEqual = true;
       for(var property in objA) {
          if (objA[property] !== objB[property]) {
             isEqual = false;
             break;
          }
       }

       return isEqual;   
    }
});

// Object extention (indexOf) : find the index of a object in an array
var indexOf = function (el) {
   for (var i = 0 ; i < this.length ; i++) {
      if ($.equals(el, this[i]))
         return i;
   }

   return -1;
};

// Global action handler
var event = function (msg) {

   var obj = $.getObj(htmlID.alertBox);
   var infoListDevice = $.getObj(htmlID.textLstDevices);
   var infoListSensor = $.getObj(htmlID.lstCapteurs_body);
   var info = memory.getDataNull("msg");

   var newDevice = msg.EndNodes;
   var newSensor = msg.Sensor;
   var oldDevice = info.EndNodes;
   var oldSensor = info.Sensor;

   // Manage devices
   if (!$.compare(newDevice,oldDevice)) {
      var lstNewDevice = $.diff(newDevice,oldDevice);
      var lstDisconnectDevice = $.diff(oldDevice,newDevice);
      var message = "";

      if (lstNewDevice.length + lstDisconnectDevice.length > 4) {
         message = "There a lot of activities. You can check the device panel for more information.";
      } else {
         for ( i = 0 ; i < lstNewDevice.length ; i++ ) {
            message += lstNewDevice[i] + " is now connected." + "<br/>";
         }

         for ( i = 0 ; i < lstDisconnectDevice.length ; i++ ) {
            message += lstDisconnectDevice[i] + " is now disconnected." + "<br/>";
         }
      }

      iEvent.show(message);
      iEvent.updateListDevice(lstNewDevice, lstDisconnectDevice);
   }

   // Manage sensor
   if (!$.compare(newSensor,oldSensor)) {
      var lstNewSensor = $.diff(newSensor,oldSensor);
      var diff = $.diff(newSensor,lstNewSensor);
      lstNewSensor = lstNewSensor.concat(diff);
      var lstOldSensor = $.diff(oldSensor,newSensor).concat(diff);

      infoListSensor.children().remove();

      for (var index = 0 ; index < lstOldSensor.length ; index++) {
         var node = "";
         node = '<div class="endNodeStart">' + iEvent.printEndNode(lstOldSensor[index].ID);
         
         for (var i = 0 ; i < lstNewSensor.length ; i++) {
            if (lstOldSensor[index].ID == lstNewSensor[i].ID &&
                lstOldSensor[index].name == lstNewSensor[i].name && 
                lstOldSensor[index].value == lstNewSensor[i].value) {
              node += iEvent.printSensor(lstNewSensor[i].name,lstNewSensor[i].value, false, false);
              lstNewSensor.splice(i,1);
            } else if (lstOldSensor[index].ID == lstNewSensor[i].ID) {
              node += iEvent.printSensor(lstNewSensor[i].name,lstNewSensor[i].value, false, true);
              lstNewSensor.splice(i,1);
            }
         }

         lstOldSensor.splice(index,1);

         node += '</div>';
         infoListSensor.append(node);
      }

      for (var index = 0 ; index < lstNewSensor.length ; ) {
         var node = "";
         node = '<div class="endNodeStart">' + iEvent.printEndNode(lstNewSensor[index].ID,true);
         node += iEvent.printSensor(lstNewSensor[index].name,lstNewSensor[index].value,true,true);
         lstNewSensor.splice(index,1);

         for ( i = 0 ; i < lstNewSensor.length ; i++) {
            if (lstNewSensor[index].ID == lstNewSensor[i].ID) {
               node += iEvent.printSensor(lstNewSensor[i].name,lstNewSensor[i].value,true,true);
               lstNewSensor.splice(i,1);
            }
         }
         node += '</div>';
         infoListSensor.append(node);
      }


   } else {
      infoListSensor.children().remove();

      for (var index = 0 ; index < oldSensor.length ; ) {
         var node = "";
         node = '<div class="endNodeStart">' + iEvent.printEndNode(oldSensor[index].ID);
         node += iEvent.printSensor(oldSensor[index].name,oldSensor[index].value,false);
         oldSensor.splice(index,1);

         for ( i = index+1 ; i < oldSensor.length; i++) {
            if (oldSensor[index].ID == oldSensor[i].ID) {
               node += iEvent.printSensor(oldSensor[i].name,oldSensor[i].value,false);
               oldSensor.splice(i,1);
            }
         }

         node += '</div>';
         infoListSensor.append(node);
      }
   }
      
   iEvent.saveMsg(msg);
};

var iEvent = {
   updateListDevice : function (lstNewDevice, lstDisconnectDevice) {
         for ( i = 0 ; i < lstNewDevice.length ; i++ ) {
            this.addDevice(lstNewDevice[i]);
         }

         for ( i = 0 ; i < lstDisconnectDevice.length ; i++ ) {
            this.removeDevice("device_"+lstDisconnectDevice[i]);
         }
   },
   saveMsg : function (msg) {
      memory.setData(htmlID.JSONMsg,msg);
   },
   show : function (msg) {
      var obj = $("#alertBox");
      var text = $("#textAlertBox");

      text.html(msg);

      this.displayEvent(obj, 3000);
   },
   addDevice : function (device) {
      $.getObj(htmlID.devices).append("<div id='device_" + device + "' class='device' draggable='true'>Address: " + device + "</div");
      addDraggableEvent($("#device_" + device));
   },
   removeDevice : function (id) {
      $("#"+id).remove();
   },
   selectDevice : function (id) {
     $.getObj(htmlID.listActiveDevice).append("<div id='selected_" + id + "' class='device' draggable='true'>" + $("#"+id).text() + "</div");
   },
   unSelectDevice : function (id) {
      var part = id.split("_");
      var _el = $("#" + part[1] + "_" + part[2]);
      iEvent.removeDevice(id);
      _el.attr("draggable",true);
      _el.removeClass("noDrag");
   },
   copyDevice : function (id) {
      var _el = $("#" + id);
      iEvent.selectDevice(id);
      _el.attr("draggable",false);
      _el.addClass("noDrag");
   },
   displayEvent : function (obj, delay) {
      _obj = obj;
      
      if (typeof obj != 'undefined' && obj != null) {
         doFade = function (obj, opa) {
            obj.css("opacity", opa);
         };

         doFade(obj,1);
         setTimeout('doFade(_obj,0)', delay);
      } else {
         console.error("displayEvent : No object with that name.");
      }
   },
   clickButton : function (e, that, action) {
      $(that).toggleClass("buttonUnClicked");
      $(that).toggleClass("buttonClicked");

      if (e.type == "mouseup") {
         iEvent.activity(action);
      }
   },
   activity : function (act) {
      switch (act) {
         case Action.logInfo :
           console.warn("activity","TODO : Action.logInfo");
           break;
         case Action.setSampleRate :
		   var value = $.getObj(htmlID.sampleRate).children("div").children().val();
		   websocket.send(value);
           console.info("Set sample rate : %d", value);
           break;
         default:
            console.error("activity","No action");
      };
   },
   printSensor : function (name, value, isNew, isNewValue) {
      var _class = "";
      var _class2 = "";

      if (isNew) {
         _class = "newData";
      } else {
         _class = "oldData";
      }

      if (isNewValue) {
         _class2 = "newData";
      } else {
         _class2 = "oldData";
      }

      return '<div class="sensor"><span class="' + _class + '">' + name + '</span> : <span class="' + _class2 + '">' + value + '</span></div>';
   },
   printEndNode : function (id, isNew) {
      var _class = "";

      if (isNew) {
         _class = "newData";
      } else {
         _class = "oldData";
      }

      return '<div class="endNode">Address : <span class=" ' + _class + '">' + id + '</span></div>';
   }
};

/*
*   Draggable
*/
var dragEvent = function () {

   var enableRemove = true;

   var checkParentID = function (e,parentID) {
      return e.dataTransfer.mozSourceNode.parentNode.id == parentID;
   }

   var draggable = function (id) {
      if (id) {
         addDraggableEvent($("#selected_"+id));
         return;
      }

      var links = $("[draggable=true]");
      for (var i = 0; i < links.length; i++) {
         addDraggableEvent(links[i]);
      }
   };

   draggable();

   var dragEvent_centerPanel = function (e, that) {
      var device = e.dataTransfer.getData('device');
      $(that).removeClass("dragOn");

      iEvent.copyDevice(device);
      draggable(device);
   };

   var dragEvent_rightPanel = function (e, that) {
      var device = e.dataTransfer.getData('device');
      iEvent.unSelectDevice(device);
   };
   
   var centerPanelEvents = function () {
      var centerPanel = $.getObj(htmlID.centerPanel); //$('#control');

      addEvent(centerPanel, 'dragover', function (e) {
         if (e.preventDefault) e.preventDefault(); // allows us to drop
         e.dataTransfer.dropEffect = 'copy';
         $(this).addClass("dragOn");
         enableRemove = false;
         return false;
      });

      addEvent(centerPanel, 'dragleave', function (e) {
         $(this).removeClass("dragOn");
         enableRemove = true;
         return false;
      });

      addEvent(centerPanel, 'drop', function (e) {
         if (e.stopPropagation) e.stopPropagation();
         if (e.preventDefault) e.preventDefault(); // allows us to drop
      
         if (checkParentID(e,htmlID.devices)) {
            dragEvent_centerPanel(e, this);
         }

         return false;
      });
   };

   centerPanelEvents();

   var dragZoneEvents = function () {
      var dragZone = $.getObj(htmlID.dragZone);

     addEvent(dragZone, 'dragover', function (e) {
         if (e.preventDefault) e.preventDefault(); // allows us to drop
         return false;
      });

      addEvent(dragZone, 'drop', function (e) {
         if (e.stopPropagation) e.stopPropagation();
         if (e.preventDefault) e.preventDefault(); // allows us to drop

         if (enableRemove && !checkParentID(e,htmlID.devices)) {
            dragEvent_rightPanel(e, this);
         }

         return false;
      });
   };

   dragZoneEvents();
};

var addDraggableEvent = function (el) {
   addEvent(el, 'dragstart', function (e) {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('device', this.id);
      $(this).addClass("dragstart");
   });

   addEvent(el, 'dragend', function (e) {
      $(this).removeClass("dragstart");
   });
};

// Local Variable Management 
var memory = {
   checkLocalStorage : function () {
      if ( typeof localStorage === "undefined" || localStorage === null )
         return false;

      return true;
   },
   getData : function (key) {
      if (memory.checkLocalStorage) {
         try {
            var value = localStorage.getItem(key);
            return value && JSON.parse(value);
         }
         catch (err) {
            return null;
         }         
      } else {
         var value = JSON.parse($.getObj(htmlID.JSONMsg).val());
         return value && JSON.parse($.getObj(htmlID.JSONMsg).val());
      }
   },
   getDataNull : function (key) {
      if (memory.checkLocalStorage) {
         var value = localStorage.getItem(key);
         if (value == null) {
            memory.setData(key,{"Sensor":[{"name":"capteur1","ID":5,"value":0},{"name":"capteur2","ID":5,"value":0}],"EndNodes":[6,9]});
            return memory.getData(key);
         }

         return value && JSON.parse(value);
      } else {
         var value = JSON.parse($.getObj(htmlID.JSONMsg).val());
         return value && JSON.parse($.getObj(htmlID.JSONMsg).val());
      }
   },
   setData : function (key, value) {
      if (memory.checkLocalStorage) {
         localStorage.setItem(key, JSON.stringify(value));
      } else {
         $.getObj(key).val(JSON.stringify(value));
      }      
   }
};

// WebSocket interface
var websocket = {
   socket : null,
   message : function (msg) { console.warn("websocket.message", "The function is not defined."); },
   init : function (fct) {
      if (!(this.socket = io.connect()))
         return false;

      this.message = fct;
      this.socketActivity();

      return true;
   },
   socketActivity : function () {
      this.socket.on('connect', function () {
         console.info("websocket.socketActivity (connect) : ", "Connected");
      });
      this.socket.on('error', function (e) {
         console.error("websocket.socketActivity (error) : ", e);
      });
      this.socket.on('reconnecting', function () {
         console.info("websocket.socketActivity (reconnecting) : ", "Reconnecting ...");
      });
      this.socket.on('reconnect', function () {
         console.info("websocket.socketActivity (reconnect) : ", "Reconnected");
      });
      this.socket.on('msg', function (msg) {
         websocket.message(msg);
      });
   },
   send : function (rate) {
      this.socket.emit('SampleRate',rate);
   }
};
