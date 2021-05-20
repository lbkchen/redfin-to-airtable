import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'clip') {
    const streetName = document.querySelector(
      "div[data-rf-test-id='abp-streetLine'] > span"
    ).textContent;
    console.log({ streetName });

    sendResponse({
      streetName,
    });
  }

  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' });
});

printLine("Using the 'printLine' function from the Print Module");
