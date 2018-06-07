import { buildScenario, registerService } from './../lib/index';

const productService = registerService({
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

const services = {
  productService,
}

export const scenarios = {
  'default scenario': buildScenario({
    ...services,
  })
}