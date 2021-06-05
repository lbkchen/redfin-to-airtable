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
      lotSqft: '',
      area: '',
      tags: [],
      url: '',
    };

    try {
      response.url = window.location.href;

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

      const detailItems = document.querySelectorAll('.keyDetail');

      [...detailItems].forEach((node) => {
        const valueNode = node.querySelector('.content');
        if (!valueNode) {
          return;
        }
        const sanitizedNumberValue = valueNode.textContent
          ? valueNode.textContent.replaceAll(/[^0-9]/g, '')
          : '';

        if (node.textContent.includes('Community')) {
          response.area = valueNode.textContent;
        }

        if (node.textContent.includes('Condo')) {
          response.tags.push('Condo');
        }
        if (node.textContent.includes('Single Family')) {
          response.tags.push('Single Family');
        }
        if (node.textContent.includes('Townhouse')) {
          response.tags.push('Townhouse');
        }

        if (
          node.textContent.includes('Lot Size') &&
          !response.tags.includes('Condo')
        ) {
          response.lotSqft = Number(sanitizedNumberValue);
        }
      });
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
