import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminListUsers,
  adminListBookings,
  adminSetRole,
  adminUpdateBooking,
  adminSetBookingQuote,
  adminGetProofUrl,
  adminReviewPayment,
  adminCreateAdmin,
  adminListInquiries,
  adminUpdateInquiry,
} from "../../lib/admin.functions";
import type { AppRole } from "../../lib/account.functions";
import { DashboardShell, StatusBadge, StatCard, formatZAR } from "../../components/dashboard-shell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import {
  CalendarCheck,
  Users,
  GraduationCap,
  Wallet,
  Eye,
  Check,
  X,
  Clock,
  UserPlus,
  Mail,
  Tag,
} from "lucide-react";
import { Textarea } from "../../components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Shuttle Dashboard" }] }),
  component: AdminDashboard,
});

const ROLES: AppRole[] = ["student", "admin"];
const STATUS_FILTERS = [
  "all",
  "pending_quote",
  "quoted",
  "confirmed",
  "completed",
  "cancelled",
] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function AdminDashboard() {
  const queryClient = useQueryClient();
  const listUsers = useServerFn(adminListUsers);
  const listBookings = useServerFn(adminListBookings);
  const setRole = useServerFn(adminSetRole);
  const updateBooking = useServerFn(adminUpdateBooking);
  const setBookingQuote = useServerFn(adminSetBookingQuote);
  const getProofUrl = useServerFn(adminGetProofUrl);
  const reviewPayment = useServerFn(adminReviewPayment);
  const createAdmin = useServerFn(adminCreateAdmin);
  const listInquiries = useServerFn(adminListInquiries);
  const updateInquiry = useServerFn(adminUpdateInquiry);

  const [bookingFilter, setBookingFilter] = useState<StatusFilter>("all");
  const [userSearch, setUserSearch] = useState("");
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const users = useQuery({ queryKey: ["admin-users"], queryFn: () => listUsers() });
  const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: () => listBookings() });
  const inquiries = useQuery({ queryKey: ["admin-inquiries"], queryFn: () => listInquiries() });

  const inquiryMutation = useMutation({
    mutationFn: (input: { inquiryId: string; status?: string; admin_notes?: string }) =>
      updateInquiry({ data: input }),
    onSuccess: () => {
      toast.success("Inquiry updated");
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const roleMutation = useMutation({
    mutationFn: (input: { userId: string; role: AppRole; action: "add" | "remove" }) =>
      setRole({ data: input }),
    onSuccess: () => {
      toast.success("Roles updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const createAdminMutation = useMutation({
    mutationFn: (input: { email: string; password: string; fullName: string; phone?: string }) =>
      createAdmin({ data: input }),
    onSuccess: () => {
      toast.success("Admin account created");
      setAddAdminOpen(false);
      setNewAdmin({ fullName: "", email: "", phone: "", password: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to create admin"),
  });

  const updateBookingMutation = useMutation({
    mutationFn: (input: { bookingId: string; status?: string }) => updateBooking({ data: input }),
    onSuccess: () => {
      toast.success("Booking updated");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const quoteMutation = useMutation({
    mutationFn: (input: { bookingId: string; amountCents: number }) =>
      setBookingQuote({ data: input }),
    onSuccess: () => {
      toast.success("Quote sent");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to set quote"),
  });

  const reviewMutation = useMutation({
    mutationFn: (input: { bookingId: string; decision: "approve" | "reject" }) =>
      reviewPayment({ data: input }),
    onSuccess: (_d, v) => {
      toast.success(
        v.decision === "approve" ? "Payment approved — plan activated" : "Payment rejected",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const viewProof = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await getProofUrl({ data: { bookingId } });
      if (!res.url) throw new Error("No proof uploaded");
      window.open(res.url, "_blank", "noopener");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not open proof"),
  });

  const allBookings = bookings.data ?? [];
  const allUsers = users.data ?? [];

  const stats = useMemo(() => {
    const active = allBookings.filter((b) => b.status !== "cancelled");
    const revenue = allBookings
      .filter((b) => b.payment_status === "paid")
      .reduce((sum, b) => sum + (b.amount_cents ?? 0), 0);
    const studentCount = allUsers.filter((u) => u.roles.includes("student")).length;
    const proofsToReview = allBookings.filter((b) => b.payment_status === "proof_submitted").length;
    const pendingQuotes = allBookings.filter((b) => b.status === "pending_quote").length;
    return {
      bookings: active.length,
      users: allUsers.length,
      students: studentCount,
      revenue,
      proofsToReview,
      pendingQuotes,
    };
  }, [allBookings, allUsers]);

  const filteredBookings =
    bookingFilter === "all" ? allBookings : allBookings.filter((b) => b.status === bookingFilter);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter(
      (u) =>
        (u.full_name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.phone ?? "").toLowerCase().includes(q),
    );
  }, [allUsers, userSearch]);

  return (
    <DashboardShell area="admin">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Active bookings" value={stats.bookings} icon={CalendarCheck} />
        <StatCard label="Total users" value={stats.users} icon={Users} />
        <StatCard label="Students" value={stats.students} icon={GraduationCap} />
        <StatCard label="Paid revenue" value={formatZAR(stats.revenue)} icon={Wallet} />
        <StatCard label="Pending quotes" value={stats.pendingQuotes} icon={Tag} />
        <StatCard label="Payments to review" value={stats.proofsToReview} icon={Clock} />
        <StatCard
          label="New inquiries"
          value={(inquiries.data ?? []).filter((i) => i.status === "new").length}
          icon={Mail}
        />
      </div>

      <Tabs defaultValue="bookings" className="mt-8">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users &amp; Roles</TabsTrigger>
          <TabsTrigger value="inquiries">
            Inquiries
            {(inquiries.data ?? []).some((i) => i.status === "new") && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                {(inquiries.data ?? []).filter((i) => i.status === "new").length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-5 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <Button
                key={f}
                variant={bookingFilter === f ? "dark" : "outline"}
                size="sm"
                className="capitalize"
                onClick={() => setBookingFilter(f)}
              >
                {f.replace("_", " ")}
              </Button>
            ))}
          </div>
          {filteredBookings.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              {allBookings.length === 0 ? "No bookings yet." : "No bookings match this filter."}
            </p>
          )}
          {filteredBookings.map((b) => {
            const route = [b.pickup_location, b.dropoff_location].filter(Boolean).join(" → ");
            return (
              <div key={b.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-bold">
                      {b.student_name || b.student_email || "Student"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {b.package_title ?? "Trip"}
                      {route ? ` · ${route}` : ""} ·{" "}
                      {b.passenger_count} passenger{b.passenger_count > 1 ? "s" : ""} ·{" "}
                      {b.amount_cents != null ? formatZAR(b.amount_cents) : "Awaiting quote"}
                    </p>
                    {b.trip_date && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(b.trip_date).toLocaleString("en-ZA")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge value={b.status} />
                    <StatusBadge value={b.payment_status} />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <BookingQuoteForm
                    bookingId={b.id}
                    amountCents={b.amount_cents}
                    onSubmit={quoteMutation.mutate}
                    isPending={quoteMutation.isPending}
                  />
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Status
                    </label>
                    <Select
                      value={b.status}
                      onValueChange={(v) =>
                        updateBookingMutation.mutate({ bookingId: b.id, status: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending_quote">Pending quote</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(b.proof_of_payment_path || b.payment_status !== "unpaid") && (
                  <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Proof of payment
                        </p>
                        {b.payment_reference && <p className="text-sm">Ref: {b.payment_reference}</p>}
                        {b.proof_submitted_at && (
                          <p className="text-xs text-muted-foreground">
                            Submitted {new Date(b.proof_submitted_at).toLocaleString("en-ZA")}
                          </p>
                        )}
                      </div>
                      {b.proof_of_payment_path && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewProof.mutate(b.id)}
                          disabled={viewProof.isPending}
                        >
                          <Eye className="h-4 w-4" /> View proof
                        </Button>
                      )}
                    </div>
                    {b.payment_status === "proof_submitted" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() =>
                            reviewMutation.mutate({ bookingId: b.id, decision: "approve" })
                          }
                          disabled={reviewMutation.isPending}
                        >
                          <Check className="h-4 w-4" /> Approve &amp; activate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            reviewMutation.mutate({ bookingId: b.id, decision: "reject" })
                          }
                          disabled={reviewMutation.isPending}
                        >
                          <X className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="users" className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by name, email or phone…"
              className="max-w-sm"
            />
            <Dialog open={addAdminOpen} onOpenChange={setAddAdminOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" size="sm">
                  <UserPlus className="h-4 w-4" /> Add admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add admin</DialogTitle>
                  <DialogDescription>
                    Creates a new admin account with the admin role. Share these credentials with
                    them so they can sign in and manage the system.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    createAdminMutation.mutate({
                      fullName: newAdmin.fullName.trim(),
                      email: newAdmin.email.trim(),
                      password: newAdmin.password,
                      phone: newAdmin.phone.trim() || undefined,
                    });
                  }}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-name">Full name</Label>
                    <Input
                      id="admin-name"
                      required
                      value={newAdmin.fullName}
                      onChange={(e) => setNewAdmin((s) => ({ ...s, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      required
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin((s) => ({ ...s, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-phone">Phone (optional)</Label>
                    <Input
                      id="admin-phone"
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin((s) => ({ ...s, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-password">Temporary password</Label>
                    <Input
                      id="admin-password"
                      type="text"
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin((s) => ({ ...s, password: e.target.value }))}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" variant="hero" disabled={createAdminMutation.isPending}>
                      {createAdminMutation.isPending ? "Creating…" : "Create admin"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {filteredUsers.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No users match your search.
            </p>
          )}
          {filteredUsers.map((u) => (
            <div key={u.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold">{u.full_name || "—"}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                  {u.phone && <p className="text-sm text-muted-foreground">{u.phone}</p>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {u.roles.length === 0 && (
                    <span className="text-xs text-muted-foreground">No roles</span>
                  )}
                  {u.roles.map((r) => (
                    <StatusBadge key={r} value={r} />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {ROLES.map((role) => {
                  const has = u.roles.includes(role);
                  return (
                    <Button
                      key={role}
                      variant={has ? "dark" : "outline"}
                      size="sm"
                      onClick={() =>
                        roleMutation.mutate({
                          userId: u.id,
                          role,
                          action: has ? "remove" : "add",
                        })
                      }
                    >
                      {has ? `Remove ${role}` : `Make ${role}`}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="inquiries" className="mt-5 space-y-3">
          {(inquiries.data ?? []).length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No inquiries yet. Messages from the contact form appear here.
            </p>
          )}
          {(inquiries.data ?? []).map((iq) => (
            <div key={iq.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold">{iq.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <a href={`mailto:${iq.email}`} className="hover:text-primary">
                      {iq.email}
                    </a>
                    {iq.phone && (
                      <>
                        {" · "}
                        <a href={`tel:${iq.phone}`} className="hover:text-primary">
                          {iq.phone}
                        </a>
                      </>
                    )}
                  </p>
                  {iq.service && (
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-primary">
                      {iq.service}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(iq.created_at).toLocaleString("en-ZA")}
                  </p>
                </div>
                <StatusBadge value={iq.status} />
              </div>
              <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">{iq.message}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Status
                  </label>
                  <Select
                    value={iq.status}
                    onValueChange={(v) => inquiryMutation.mutate({ inquiryId: iq.id, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Internal notes
                  </label>
                  <Textarea
                    rows={2}
                    defaultValue={iq.admin_notes ?? ""}
                    placeholder="Add a note, then click Save"
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val !== (iq.admin_notes ?? "")) {
                        inquiryMutation.mutate({ inquiryId: iq.id, admin_notes: val });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

/** Inline quote entry/update for a single booking — local draft state per row. */
function BookingQuoteForm({
  bookingId,
  amountCents,
  onSubmit,
  isPending,
}: {
  bookingId: string;
  amountCents: number | null;
  onSubmit: (input: { bookingId: string; amountCents: number }) => void;
  isPending: boolean;
}) {
  const [value, setValue] = useState(amountCents != null ? (amountCents / 100).toFixed(2) : "");

  return (
    <form
      className="flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const rands = Number(value);
        if (!Number.isFinite(rands) || rands < 0) return;
        onSubmit({ bookingId, amountCents: Math.round(rands * 100) });
      }}
    >
      <div className="flex-1 space-y-1.5">
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          {amountCents != null ? "Update quote (R)" : "Set quote (R)"}
        </label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0.00"
        />
      </div>
      <Button type="submit" variant="hero" size="sm" disabled={isPending || value === ""}>
        {amountCents != null ? "Update" : "Send quote"}
      </Button>
    </form>
  );
}