import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. We've received your order and our bakers are getting ready.
        </p>
        
        {searchParams?.id && (
          <div className="mt-4 p-4 rounded-lg bg-muted text-sm">
            Order Reference: <span className="font-mono font-bold">{searchParams.id}</span>
          </div>
        )}
      </div>

      <div className="pt-8">
        <Link 
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
}
