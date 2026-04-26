"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().min(0.01, "Price must be strictly greater than 0"),
  image_url: z.string().url("Please enter a valid URL for the image"),
  is_available: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product; // Defined when in Edit Mode
  isOpen: boolean;
  onClose: () => void;
}

export function ProductForm({ product, isOpen, onClose }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          is_available: product.is_available ?? true,
        }
      : {
          name: "",
          description: "",
          price: 1.0,
          image_url: "",
          is_available: true,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    setError(null);
    const supabase = createClient();

    try {
      if (product) {
        // Edit Mode
        const { error: updateError } = await supabase
          .from("products")
          .update({
            name: data.name,
            description: data.description,
            price: data.price,
            image_url: data.image_url,
            is_available: data.is_available,
          })
          .eq("id", product.id);

        if (updateError) throw updateError;
      } else {
        // Create Mode
        const { error: insertError } = await supabase.from("products").insert([
          {
            name: data.name,
            description: data.description,
            price: data.price,
            image_url: data.image_url,
            is_available: data.is_available,
          },
        ]);

        if (insertError) throw insertError;
      }

      router.refresh(); // Refresh tables strictly
      if (!product) reset(); // Clean fields if it was new
      onClose();
    } catch (err: any) {
      console.error("Mutation error:", err);
      setError(err.message || "Failed to save the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex items-center justify-center p-4 sm:p-0">
      <div className="relative w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {product
              ? "Make changes to your product here. Click save when you're done."
              : "Fill in the details to add a new product to your bakery inventory."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="name">
              Product Name
            </label>
            <input
              id="name"
              {...register("name")}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.name ? "border-destructive focus-visible:ring-destructive" : "border-input"
              }`}
            />
            {errors.name && (
              <p className="text-[0.8rem] text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.description ? "border-destructive focus-visible:ring-destructive" : "border-input"
              }`}
            />
            {errors.description && (
              <p className="text-[0.8rem] text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="price">
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.price ? "border-destructive focus-visible:ring-destructive" : "border-input"
                }`}
              />
              {errors.price && (
                <p className="text-[0.8rem] text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="is_available">
                Visibility
              </label>
              <div className="flex h-10 items-center space-x-2 rounded-md border border-input px-3">
                <input
                  id="is_available"
                  type="checkbox"
                  {...register("is_available")}
                  className="h-4 w-4 rounded border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <span className="text-sm text-muted-foreground">Available to purchase</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="image_url">
              Image URL
            </label>
            <input
              id="image_url"
              type="url"
              {...register("image_url")}
              placeholder="https://..."
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.image_url ? "border-destructive focus-visible:ring-destructive" : "border-input"
              }`}
            />
            {errors.image_url && (
              <p className="text-[0.8rem] text-destructive">{errors.image_url.message}</p>
            )}
          </div>

          {error && <div className="text-[0.8rem] font-medium text-destructive">{error}</div>}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
