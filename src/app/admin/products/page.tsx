import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { ProductActions } from "@/components/admin/ProductActions";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = await createClient();

  // Fetch all products (available and unavailable)
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products fetch error:", error);
  }

  const productList = (products || []) as Product[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your bakery inventory.</p>
        </div>
        <ProductActions />
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-16">
                  Image
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">
                  Price
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-center">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {productList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-24 text-center text-muted-foreground">
                    No products found.
                  </td>
                </tr>
              ) : (
                productList.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">
                      <div className="h-10 w-10 overflow-hidden rounded-md border bg-muted">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {product.name}
                    </td>
                    <td className="p-4 align-middle text-right font-medium">
                      ${(product.price || 0).toFixed(2)}
                    </td>
                    <td className="p-4 align-middle text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          product.is_available
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {product.is_available ? "Available" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <ProductActions product={product} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
