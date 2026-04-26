export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available?: boolean;
  created_at?: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price_at_time: number;
}

export interface Profile {
  id: string;
  role: "admin" | "user";
  created_at?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  delivery_address: string;
  total_amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
}
