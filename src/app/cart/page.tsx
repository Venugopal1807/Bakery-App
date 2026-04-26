"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/useCartStore";
import { useMounted } from "@/hooks/useMounted";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const mounted = useMounted();
  const { items, updateQuantity, removeItem, cartTotal } = useCartStore();

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-6 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you haven&apos;t added any baked goods to your cart yet.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
      
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <ul className="divide-y divide-border rounded-lg border bg-card">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between sm:grid sm:grid-cols-2">
                    <div className="pr-4">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="text-right sm:text-left">
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-md border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex w-10 justify-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm font-medium text-destructive hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="md:col-span-4">
          <div className="sticky top-24 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cartTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>${cartTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                href="/checkout"
                className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Proceed to Checkout
              </Link>
            </div>
            
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground flex justify-center items-center gap-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
