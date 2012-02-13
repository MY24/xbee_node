// For discussion and comments, see: http://remysharp.com/2009/01/07/html5-enabling-script/
/*@cc_on'abbr article aside audio canvas details figcaption figure footer header hgroup mark menu meter nav output progress section summary time video'.replace(/\w+/g,function(n){document.createElement(n)})@*/

var addEvent = (function () {
   return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
         el.addEventListener(type, fn, false);
      } else if (el && el.length) {
         for (var i = 0; i < el.length; i++) {
           addEvent(el[i], type, fn);
         }
      }
   };
})();
