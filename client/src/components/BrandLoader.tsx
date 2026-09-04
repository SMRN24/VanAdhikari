import { cn } from "@/lib/utils";

type BrandLoaderProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function BrandLoader({ label = "Loading", size = "md", className }: BrandLoaderProps) {
  return (
    <span className={cn("brand-loader", `brand-loader-${size}`, className)} role="status" aria-label={label}>
      <span className="brand-loader-mark"><img src="/assets/vanadhikar-logo.png" alt="" /></span>
      <span className="brand-loader-orbit" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
