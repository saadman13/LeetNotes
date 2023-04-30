// Time outs used to wait for the DOM to load, but need to figure out a better way to do this later.
setTimeout(() => {
  const codeElements = document.getElementsByTagName("code");
  const code = codeElements[0].textContent;
  console.log(code);
  chrome.runtime.sendMessage({ code: code }, (response) => {
    console.log(response);
  });
}, 1000);
