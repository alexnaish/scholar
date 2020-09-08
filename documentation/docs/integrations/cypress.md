---
title: Cypress
---

1. Install the integration.

```sh
	npm i -D @scholar/cypress
```


2. Make the Snapshot command available to Cypress.

```js title="cypress/support/commands.js"

const scholarCommand = require('@scholar/cypress/command');
scholarCommand(Cypress);

// or if you want more visibility:

const { name, command }  = require('@scholar/cypress/command');
Cypress.Commands.add(name, { prevSubject: 'optional' }, command);

```

3. Configure the Scholar plugin.

```js title="cypress/plugins/index.js"

module.exports = (on, config) => {

	// Any other plugin logic

	require('@scholar/cypress/plugin')(on, {
		key: process.env.SCHOLAR_API_KEY,
	});

	return config;
};

```

4. Use in your tests!

```js

context('My website', () => {
	it('should render the intro section properly', () => {
		cy.visit('/');
		cy.get('.intro').scholarSnapshot('intro-section');
	});

	it('should render the entire page properly', () => {
		cy.visit('/another');
		cy.scholarSnapshot('another-page');
	});

});


```
