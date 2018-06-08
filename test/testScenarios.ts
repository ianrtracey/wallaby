import { buildScenario, registerService, overrideService, Services, Service } from './../lib/index';

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

const services: Services = {
  productService,
}



export const scenarios = {
  'default scenario': buildScenario({
    ...services,
  }),
  'product service is down': buildScenario({
    ...services,
   productService: overrideService(productService)
      .respondWith({
        status: 500,
        body: null,
      })
  })
}

export const scenarios = [
  new Scenario({
    ''
  })
]