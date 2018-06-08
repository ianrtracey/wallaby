import { scenario, service } from './../lib/index';

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

const services = {
  productService,
}

export const scenarios = scenarios(services, () => {
  scenario('product service is down', () => {
    services.productService
      .overrideService
      .respondWith({
        status: 500,
      })
  })

  scenario('no products', () => {
    services.productServicepre
      .overrideService
      .withEndpoint('with ')
      .respondWith({
        status: 200,
        body: [],
      })
  })
})
  scenario('default scenario is down', services),
  scenario('product service is down', {
    ...services,

  })

  })
]

export const scenarios = {

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
