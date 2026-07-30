export interface ServicePackage {
  code: string;
  title: string;
  subtitle: string;
  perLesson: string;
  bundles: { label: string; price: string }[];
  hire: { label: string; price: string };
  transport: string;
  featured?: boolean;
}
export const bankingDetails = {
  bank: "Capitec",
  accountHolder: "NJ Driving School & Shuttle Services",
  accountNumber: "1055441999",
  branchCode: "470010",
  reference: "Booking (Trip Type)",
  note: "Use your booking's Trip type as the payment reference, then upload your proof of payment below. Your plan activates once an admin approves it.",
};

export const contactInfo = {
  name: "Nthlakusani & Jama Driving School & Shuttle Services",
  shortName: "Nthlakusani & Jama",
  tagline: "We Drive You Forward!",
  since: "Since 2026",
  phones: [
    { label: "Calls", number: "064 556 9752", tel: "+27645569752" },
    { label: "Personal line", number: "081 323 0184", tel: "+27813230184" },
    { label: "Landline", number: "012 140 0291", tel: "" },
  ],
  emails: [" info@njshuttleservice.co.za"],
};
