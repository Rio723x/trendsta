import DodoPayments from "dodopayments";

const client = new DodoPayments({
     bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: "test_mode",
})

export type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_recurring: boolean;
};

export async function getProducts(page_size: number, page_number: number){
  const pdts = await client.products.list({
    page_size:page_size, page_number: page_number
  });

  return pdts;
}