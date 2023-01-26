interface AppConfig {
  baseUrl: string;
  graphqlUrl: string;
  solanaRPCUrl: string;
  referralUrl: string;
  referralKey: string;
  socialMedia: {
    twitter?: string;
    discord?: string;
    medium?: string;
  };
  offerMinimums: {
    percentageFloor: number;
    percentageListing: number;
  };
  buddylink: {
    organizationName: string;
    buddyBPS: number;
  };
  website: string;
  auctionHouse: string;
  addressLookupTable: string;
}

const config: AppConfig = {
  baseUrl: 'https://nightmarket.io', // could also be an ENV variable
  graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
  solanaRPCUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string,
  referralUrl: process.env.NEXT_PUBLIC_REFERRAL_URL as string,
  referralKey: process.env.NEXT_PUBLIC_REFERRAL_KEY as string,
  socialMedia: {
    twitter: 'https://twitter.com/nightmarketio',
    discord: 'https://discord.gg/bn5z4A794E',
    medium: 'https://medium.com/@Motleydao',
  },
  website: 'https://motleylabs.com',
  auctionHouse: process.env.NEXT_PUBLIC_AUCTION_HOUSE_ADDRESS as string,
  offerMinimums: {
    percentageFloor: 0.8,
    percentageListing: 0.8,
  },
  buddylink: {
    organizationName: 'a24nzg60',
    buddyBPS: 0,
  },
  addressLookupTable: process.env.NEXT_PUBLIC_ADDRESS_LOOKUP_TABLE as string,
};

export default config;
