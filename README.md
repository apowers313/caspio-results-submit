# caspio-results-submit
This is intended to work in conjunction with mocha-reporter-html-json. It has a few interfaces that are probably non-obvious:
* Catches "json-request" from mocha-reporter-html-json when the tests end.
* If the tests passed, it sets CSS "display: block" on a item called "mocha-results" to make that item appear. This is intended to be a form for sumbmitting results.
* The results form is expected to call "submitResults" as its onsubmit handler. There must be inputs with the IDs: `tool-version`, `protocol-family`, `protocol-version`, `guid`, and `product`

The results will then be submited to Caspio.