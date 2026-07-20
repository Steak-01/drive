import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Landmark, Upload, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { bankingDetails } from "../data/site";
import { submitPaymentProof, getMyProofUrl } from "../lib/payments.functions";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "application/pdf"] as const;

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export function PaymentPanel({
  bookingId,
  paymentStatus,
  amountLabel,
}: {
  bookingId: string;
  paymentStatus: string;
  amountLabel: string;
}) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [reference, setReference] = useState("");

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a file first");
      if (!ALLOWED.includes(file.type as (typeof ALLOWED)[number]))
        throw new Error("Upload a PNG, JPG, WEBP or PDF");
      if (file.size > 8 * 1024 * 1024) throw new Error("File too large (max 8MB)");
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });
      await submitPaymentProof({
        data: {
          bookingId,
          fileBase64,
          contentType: file.type as (typeof ALLOWED)[number],
          reference: reference || undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("Proof of payment submitted for approval.");
      setFile(null);
      setReference("");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Upload failed"),
  });

  const viewProof = useMutation({
    mutationFn: async () => {
      const res = await getMyProofUrl({ data: { bookingId } });
      if (!res.url) throw new Error("Proof not available");
      window.open(res.url, "_blank", "noopener");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not open proof"),
  });

  if (paymentStatus === "paid") {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
        <CheckCircle2 className="h-4 w-4" /> Payment approved — your plan is active.
      </div>
    );
  }

  if (paymentStatus === "proof_submitted") {
    return (
      <div className="mt-4 space-y-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="flex items-center gap-2 font-semibold">
          <Clock className="h-4 w-4" /> Proof submitted — awaiting admin approval.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => viewProof.mutate()}
          disabled={viewProof.isPending}
        >
          {viewProof.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          View my proof
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
      {paymentStatus === "rejected" && (
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700">
          <XCircle className="h-4 w-4" /> Previous proof was rejected. Please re-upload.
        </p>
      )}
      <p className="flex items-center gap-2 font-display text-sm font-bold uppercase">
        <Landmark className="h-4 w-4 text-primary" /> Pay by EFT — {amountLabel}
      </p>
      <div className="mt-3 divide-y divide-border rounded-lg bg-card p-3">
        <DetailRow label="Bank" value={bankingDetails.bank} />
        <DetailRow label="Account holder" value={bankingDetails.accountHolder} />
        <DetailRow label="Account no." value={bankingDetails.accountNumber} />
        <DetailRow label="Branch code" value={bankingDetails.branchCode} />
        <DetailRow label="Reference" value={bankingDetails.reference} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{bankingDetails.note}</p>

      <div className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor={`ref-${bookingId}`}>Payment reference used (optional)</Label>
          <Input
            id={`ref-${bookingId}`}
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. Code 8 — J. Dlamini"
            maxLength={120}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`pop-${bookingId}`}>Upload proof of payment (PNG, JPG, PDF)</Label>
          <Input
            id={`pop-${bookingId}`}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <Button
          variant="hero"
          size="sm"
          className="w-full"
          onClick={() => upload.mutate()}
          disabled={upload.isPending || !file}
        >
          {upload.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Submit proof of payment
        </Button>
      </div>
    </div>
  );
}
