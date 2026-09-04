import { BrandLoader } from "@/components/BrandLoader";

type SpinnerProps = { className?: string };

function Spinner({ className }: SpinnerProps) {
  return <BrandLoader size="sm" className={className} />;
}

export { Spinner };
