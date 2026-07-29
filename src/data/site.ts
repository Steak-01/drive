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

export const contactInfo = {
  name: "Nthlakusani & Jama Driving School & Shuttle Services",
  shortName: "Nthlakusani & Jama",
  tagline: "We Drive You Forward!",
  since: "Since 2026",
  phones: [
    { label: "Calls", number: "0813230184", tel: "+27813230184" },
    { label: "WhatsApp", number: "0762207592", tel: "+27762207592" },
  ],
  emails: [" info@njshuttleservice.co.za"],
};
