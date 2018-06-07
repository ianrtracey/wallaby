import flatten from 'lodash.flatten';
import parrot from 'parrot-middleware';
export const middleware = parrot;

export type Service<T extends { [key: string]: ServiceEndpoint }> = {
  [K in keyof T]: ServiceEndpoint;
};

export interface Services {
  [name: string]: Service<any>
}

export type HTTPMethod = 'GET' | 'POST';
export interface ServiceEndpoint {
  method: HTTPMethod;
  url: string;
  defaultResponse: DefaultResponse;
}

export interface DefaultResponse {
  status: number;
  headers?: any;
  body?: any;
}

export function registerService<T extends { [key: string]: ServiceEndpoint }>(service: T): Service<T> {
  return service as any;
}


interface ParrotScenario {
  [description: string]: [Scenario];
}

interface Scenario {
  request: Request;
  response: Response;
}

interface Request {
  path: string;
  method: HTTPMethod;
}
interface Response {
  status?: number;
  body: {};
}

const extractServiceEndpoints = (service: Service<any>) => (
  Object.keys(service).map(endpointKey => ({
    ...service[endpointKey],
  }))
);

export const buildScenario = (services: Services): [ParrotScenario] => {
  const endpoints = Object.keys(services)
    .map(serviceName => services[serviceName])
    .map(extractServiceEndpoints);

  const res = flatten(endpoints).map(toParrotScenario);
  console.log(
    res.map(e => e.request.path),
  );

  return res;
};

const toParrotScenario = (endpoint: ServiceEndpoint) => {

  return {
    request: {
      path: sanitizeUrl(endpoint.url),
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

const sanitizeUrl = (url: string) => {
  if (url.includes('localhost:3002')) {
    return url.split('localhost:3002')[1];
  }

  return url;
};

export function overrideService<P extends { [key: string]: ServiceEndpoint }, S extends Service<P>>(service: S) {
  return {
    respondWith: (response: any) => {
      Object.keys(service).forEach(endpoint => {
        service[endpoint] = {
          ...service[endpoint],
          defaultResponse: response,
        };
      });

      return service;
    },

    withEndpoint: <K extends keyof S>(endpoint: K) => ({
      respondWith: (response: Response) => {
        const s: any = service[endpoint];
        service[endpoint] = {
          ...s,
          defaultResponse: response,
        };

        return service;
      },
    }),
  };
}
