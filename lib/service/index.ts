export type HTTPMethod = 'GET' | 'POST';

interface Request {
  path: string;
  method: HTTPMethod;
}
interface Response {
  status?: number;
  body: {};
}


export interface Services {
  [name: string]: Service<any>
}

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

export function service<T extends { [key: string]: ServiceEndpoint }>(service: T) {

  return {
    service,
    overrideService: () => overrideService(service),
  }
}


export type Service<T extends { [key: string]: ServiceEndpoint }> = {
  [K in keyof T]: ServiceEndpoint;
};

export const extractServiceEndpoints = (service: Service<any>) => (
  Object.keys(service).map(endpointKey => ({
    ...service[endpointKey],
  }))
);



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