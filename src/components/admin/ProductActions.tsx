"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { ProductForm } from "./ProductForm";
import { Pencil, Trash2, Plus } from "lucide-react";

export function ProductActions({ product }: { product?: Product }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!product) return;
    
    const confirm = window.confirm(
      `Are you sure you want to delete ${product.name}? This action cannot be undone.`
    );

    if (confirm) {
      setIsDeleting(true);
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", product.id);

      if (error) {
        console.error("Failed to delete product", error);
        alert("Failed to delete the product.");
      } else {
        router.refresh();
      }
      setIsDeleting(false);
    }
  };

  // Create Mode handling (Add Button usage context)
  if (!product) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </button>
        <ProductForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Edit/Delete Mode handling
  return (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Edit product"
      >
        <Pencil className="h-4 w-4" />
      </button>
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium text-destructive shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        aria-label="Delete product"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <ProductForm 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
