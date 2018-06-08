# Wallaby
**A toolset for scenario mocking and testing modern frontends**

<img align="center" height="200" src="./logo.png">

# Overview
Wallaby is a toolset for defining a common set of scenarios that can be used for mocking your application locally as well mocking requests during integration testing.

# Installation
```bash
npm i -g wallaby
```

# Usage
Wallaby can be used both to mock requests locally as part of a mock server as well as part of an integration test.


## Define Services
```javascript
import { service } from 'wallaby';

const productService = service({
  getAllProducts: {
    method: 'GET',
    url: '/products',
    defaultResponse: {
      status:  200,
      body: [
        {
          name: 'product',
          price: '$10.00'
        }
      ]
    }
  }
})

export const services = {
  productService,
}
```


## Define Scenarios
```javascript
import { scenarios, scenario } from 'wallaby';

export const scenarios = scenarios(services, () => {
  scenario('product service is down', () => {
    services.productService
      .overrideService
      .respondWith({
        status: 500,
      })
  })

  scenario('no products', () => {
    services.productService
      .overrideService
      .withEndpoint('getAllProducts')
      .respondWith({
        status: 200,
        body: [],
      })
  })
})
```

## Mock Your Application Locally
Wallaby middleware drops into express with your existing scenarios

```javascript
import { middleware } from 'wallaby';
import express from 'express';

import { scenarios } from './testScenarios';
 
const port = 3002;
 
const app = express();
app.use(middleware(scenarios));
app.listen(port);

console.log(`Running mock scenario server on localhost:${port}`);
```
### Switch Between Scenarios During Development
You can then use the Parrot chrome extension to switch between states during local development:

![parrot](https://github.com/americanexpress/parrot/blob/master/assets/parrot-devtools.gif?raw=true)


## Mock Your Application in Integration Tests
Wallaby supports setting an active scenario during an integration test (using fetch-mock).

```javascript
import wallaby from 'wallaby'
import { scenarios } from './scenarios';

const wallabyMock = wallaby(scenarios);
// this will mock all requests according to that scenarios's spec
wallabyMock.setActiveScenario('no products');

// rest of integration tests goes here
// ...
```

# Prior Art
Wallaby is based off of a similar framework, Parrot but focuses more on default application behavior and more flexibility around override just parts of your application's behavior.