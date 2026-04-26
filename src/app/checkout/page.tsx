"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/lib/store/useCartStore";
import { useMounted } from "@/hooks/useMounted";
import { createClient } from "@/lib/supabase/client";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Please enter a valid email address"),
  delivery_address: z.string().min(10, "Please enter a complete address"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useMounted();
  const { items, cartTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Double check in case users hit checkout from URL while cart is empty
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          onClick={() => router.push("/")}
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const supabase = createClient();
      
      const payload = {
        p_customer_name: data.customer_name,
        p_customer_email: data.customer_email,
        p_delivery_address: data.delivery_address,
        p_total_amount: cartTotal(),
        p_items: items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
          price_at_time: i.price,
        })),
      };

      const { data: orderId, error } = await supabase.rpc("create_order", payload);

      if (error) {
        throw error;
      }

      if (!orderId) {
        throw new Error("Order creation failed, no ID returned.");
      }

      clearCart();
      router.push(`/order-success?id=${orderId}`);
    } catch (err: any) {
      console.error("Order submission error:", err);
      setServerError(err.message || "Something went wrong while processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Delivery Details</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="customer_name">
                  Full Name
                </label>
                <input
                  id="customer_name"
                  type="text"
                  {...register("customer_name")}
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.customer_name ? "border-destructive focus-visible:ring-destructive" : "border-input"
                  }`}
                  placeholder="Jane Doe"
                />
                {errors.customer_name && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {errors.customer_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="customer_email">
                  Email Address
                </label>
                <input
                  id="customer_email"
                  type="email"
                  {...register("customer_email")}
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.customer_email ? "border-destructive focus-visible:ring-destructive" : "border-input"
                  }`}
                  placeholder="jane@example.com"
                />
                {errors.customer_email && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {errors.customer_email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="delivery_address">
                  Delivery Address
                </label>
                <textarea
                  id="delivery_address"
                  {...register("delivery_address")}
                  className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.delivery_address ? "border-destructive focus-visible:ring-destructive" : "border-input"
                  }`}
                  placeholder="123 Bakery Lane, Sweet Town, ST 12345"
                />
                {errors.delivery_address && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {errors.delivery_address.message}
                  </p>
                )}
              </div>
            </div>

            {serverError && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {serverError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-8 h-10 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : `Pay $${cartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Order</h2>
            <ul className="space-y-4 divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between pt-4 first:pt-0">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t pt-4 font-semibold">
              <span>Total</span>
              <span>${cartTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
