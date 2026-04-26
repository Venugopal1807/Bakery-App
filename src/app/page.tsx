import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  // Fetch available products
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Our Fresh Pastries</h1>
        <p className="mt-2 text-muted-foreground">
          Handcrafted daily with love and the finest ingredients.
        </p>
      </div>
      
      <ProductGrid products={(products as Product[]) || []} />
    </div>
  );
}

