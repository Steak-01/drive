import { Link } from "@tanstack/react-router";
import { Tag } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="bg-gradient-red text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-sm font-semibold sm:px-6 lg:px-8">
        <Tag className="h-4 w-4 shrink-0" />
        <span>
          Opening Special — First 10 customers get{" "}
          <span className="font-bold underline underline-offset-2">R150–R200 OFF</span>
        </span>
        <Link
          to="/contact"
          className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wide hover:bg-white/30"
        >
          Claim now
        </Link>
      </div>
    </div>
  );
}
