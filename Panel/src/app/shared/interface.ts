export interface TwitchProduct {
  domain: string;
  sku: string;
  cost: TwitchCost;
  inDevelopment: boolean;
  displayName: string;
  broadcast: boolean;
}

export interface TwitchCost {
  amount: number;
  type: string;
}
