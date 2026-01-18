declare module 'amadeus' {
  export interface AmadeusConfig {
    clientId: string;
    clientSecret: string;
    hostname?: 'test' | 'production';
  }

  export default class Amadeus {
    constructor(config: AmadeusConfig);
    
    shopping: {
      flightOffersSearch: {
        get(params: any): Promise<any>;
      };
      flightOffers: {
        pricing: {
          post(body: string): Promise<any>;
        };
      };
    };
    
    booking: {
      flightOrders: {
        post(body: string): Promise<any>;
      };
    };
    
    referenceData: {
      locations: {
        get(params: any): Promise<any>;
      };
    };
  }
}
