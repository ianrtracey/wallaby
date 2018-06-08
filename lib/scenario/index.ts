import { flatten } from 'lodash';
import { extractServiceEndpoints, Services, ServiceEndpoint } from "../service";

interface Scenario {
  request: Request;
  response: Response;
}

interface ParrotScenario {
  [description: string]: Scenario[];
}

const toParrotScenario = (endpoint: ServiceEndpoint) => {

  return {
    request: {
      path: endpoint.url,
      method: endpoint.method,
    },
    response: {
      headers: {
        'Content-Type': 'application/json',
      },
      body: endpoint.defaultResponse.body,
      status: endpoint.defaultResponse.status,
    },
  };
};

export const scenarios = (services: Services, scenarios: any): ParrotScenario[] {
  
}


export const scenario = (services: Services): ParrotScenario[] => {
  const endpoints = Object.keys(services)
    .map(serviceName => services[serviceName])
    .map(extractServiceEndpoints);

  const res = flatten(endpoints).map(toParrotScenario);
  console.log(
    res.map(e => e.request.path),
  );

  return res as any;
};



  