/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************************!*\
  !*** ./src/contentScript/submissionContent.js ***!
  \************************************************/
// Time outs used to wait for the DOM to load, but need to figure out a better way to do this later.
setTimeout(function () {
  var codeElements = document.getElementsByTagName("code");
  var code = codeElements[0].textContent;
  console.log(code);
  chrome.runtime.sendMessage({
    code: code
  }, function (response) {
    console.log(response);
  });
}, 1000);
/******/ })()
;
//# sourceMappingURL=submissionContent.js.map