import { createClient } from "@/lib/supabase/server";
import { Order } from "@/types";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createClient();

  // Fetch all orders ordered by descending created_at
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Order fetch error:", error);
  }

  const orderList = (orders || []) as Order[];

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders.</p>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Order ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Customer Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">
                  Total
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-center">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">
                  Ordered At
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {orderList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orderList.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium font-mono">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="p-4 align-middle">{order.customer_name}</td>
                    <td className="p-4 align-middle">{order.customer_email}</td>
                    <td className="p-4 align-middle text-right font-medium">
                      ${(order.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="p-4 align-middle text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusBadgeColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
