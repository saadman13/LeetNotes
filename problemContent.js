setTimeout(afterDOMLoaded, 2000);
function afterDOMLoaded() {
  const divElement = document.querySelector('.h-full:not([class*=" "])');
  const spanElement = divElement.querySelector("span");
  const spanContent = spanElement.textContent;
  console.log(spanContent);
  chrome.storage.sync.set(
    {
      problemTitle: spanContent,
    },
    () => {
      console.log(`problemTitle is set to ${spanContent}`);
    }
  );
}
