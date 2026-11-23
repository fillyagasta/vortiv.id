export type Product = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  category: string;
  colors: string[];
  image: string;
  description: string;
  tag?: string | null;
  active?: boolean;
  created_at?: string;
};

export type CartLine = { productId: string; color: string; quantity: number };

export type ProductDraft = Omit<Product, 'id' | 'created_at'> & { id?: string };
