export type PublicDomain = {
  id: string;
  name: string;
  priceUSD: number;
  category: string;
  age: number;
  as: number;
  da: number;
  pa: number;
  dr: number;
  backlinks: number;
  tag?: string | null;
  tags: string[];
  description: string;
  status?: "AVAILABLE" | "RESERVED" | "SOLD" | "INACTIVE";
};
