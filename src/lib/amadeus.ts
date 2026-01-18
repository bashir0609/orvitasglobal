import Amadeus from 'amadeus';

// Initialize Amadeus client
let amadeusClient: Amadeus | null = null;

export function getAmadeusClient(): Amadeus {
  if (!amadeusClient) {
    const apiKey = process.env.AMADEUS_API_KEY;
    const apiSecret = process.env.AMADEUS_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('Amadeus API credentials are not configured');
    }

    amadeusClient = new Amadeus({
      clientId: apiKey,
      clientSecret: apiSecret,
      hostname: 'test', // Use 'production' for live environment
    });
  }

  return amadeusClient;
}

export default getAmadeusClient;
