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
    { label: "Calls", number: "0645569752", tel: "+27645569752" },
    { label: "WhatsApp", number: "0645569752", tel: "+27645569752" },
  ],
  emails: [" info@njshuttleservice.co.za"],
};
