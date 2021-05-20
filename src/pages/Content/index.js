import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'clip') {
    const response = {
      streetName: '',
      price: '',
      numBeds: '',
      numBaths: '',
      sqft: '',
    };

    try {
      response.streetName = document.querySelector(
        "div[data-rf-test-id='abp-streetLine'] > span"
      ).textContent;

      response.price = Number(
        document
          .querySelectorAll(
            // This is brittle
            'div.price-section div.statsValue span'
          )[1]
          .textContent.replaceAll(',', '')
      );
      response.numBeds = Number(
        document.querySelector('div.beds-section .statsValue').textContent
      );
      response.numBaths = Number(
        document.querySelector('div.baths-section .statsValue').textContent
      );
      response.sqft = Number(
        document
          .querySelector('div.sqft-section .statsValue')
          .textContent.replaceAll(',', '')
      );
    } catch (err) {
      console.error(err);
    }

    sendResponse(response);
    console.log('Sent response:', response);
  }

  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' });
});

printLine("Using the 'printLine' function from the Print Module");
