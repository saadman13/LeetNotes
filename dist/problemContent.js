/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************************************!*\
  !*** ./src/contentScript/problemContent.js ***!
  \*********************************************/
setTimeout(afterDOMLoaded, 2000);
function afterDOMLoaded() {
  var divElement = document.querySelector('.h-full:not([class*=" "])');
  var spanElement = divElement.querySelector("span");
  var spanContent = spanElement.textContent;
  console.log(spanContent);
  chrome.storage.sync.set({
    problemTitle: spanContent
  }, function () {
    console.log("problemTitle is set to ".concat(spanContent));
  });
}
/******/ })()
;
//# sourceMappingURL=problemContent.js.map