export type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
};

export const products: Product[] = [
 
  {
    product_id: "pdt_0NWvdNgnGXCcADDk4MJDH",
    name: "Stellas Bundle",
    description: "A value packed bundle of 100 stellas for your needs.",
    price: 2500, // in cents
    features: [
      "100 stellas"
    ],
  },
 
  {
    product_id: "pdt_0NWyeKym8LDKoNKB9E7do",
    name: "Trendsta Pro",
    description: "Pro Plan Perfect for Creators",
    price: 2500, // in cents
    features: [
      "Dashboard",
      "IG insights",
      "Competitor Analysis"
    ],
  },
];