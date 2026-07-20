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

export const services: ServicePackage[] = [
  {
    code: "Code 8",
    title: "Light Motor Vehicle",
    subtitle: "Standard cars & light vehicles — the most popular licence.",
    perLesson: "R220",
    bundles: [
      { label: "5 Lessons", price: "R2520" },
      { label: "10 Lessons", price: "R3620" },
    ],
    hire: { label: "Car hire (test day)", price: "R900" },
    transport: "R200",
    featured: true,
  },
  {
    code: "Code 10",
    title: "Heavy Motor Vehicle",
    subtitle: "Trucks and heavier commercial vehicles.",
    perLesson: "R250",
    bundles: [
      { label: "5 Lessons", price: "R2870" },
      { label: "10 Lessons", price: "R4130" },
    ],
    hire: { label: "Truck hire (test day)", price: "R1 100" },
    transport: "R200",
  },
  {
    code: "Code 14",
    title: "Extra Heavy Vehicle",
    subtitle: "Articulated trucks and extra-heavy combinations.",
    perLesson: "R400",
    bundles: [
      { label: "5 Lessons", price: "R4320" },
      { label: "10 Lessons", price: "R6320" },
    ],
    hire: { label: "Truck hire (test day)", price: "R1 800" },
    transport: "R200",
  },
  {
    code: "Code 1",
    title: "Motorcycle",
    subtitle: "Two-wheeler licence training for bikes and scooters.",
    perLesson: "R200",
    bundles: [
      { label: "5 Lessons", price: "R2270" },
      { label: "10 Lessons", price: "R3270" },
    ],
    hire: { label: "Bike hire (test day)", price: "R750" },
    transport: "R200",
  },
];

export const learnersLicence = {
  title: "Learner's Licence",
  price: "R1000",
  description:
    "Full learner's licence preparation including study material and transportation to your test.",
  includes: ["Study material", "Transportation", "Practice tests", "Theory coaching"],
};

export const bankingDetails = {
  bank: "Capitec",
  accountHolder: "T Someone",
  accountNumber: "1914671946",
  branchCode: "40016",
  reference: "Booking (Code Type)",
  note: "Use your booking's licence code as the payment reference, then upload your proof of payment below. Your plan activates once an admin approves it.",
};

export const contactInfo = {
  name: "Nthlakusani & Jama Driving School & Shuttle Services",
  shortName: "Nthlakusani & Jama",
  tagline: "We Drive You Forward!",
  since: "Since 2026",
  phones: [
    { label: "Calls", number: "0813230184", tel: "+27813230184" },
    { label: "WhatsApp", number: "0762207592", tel: "+27762207592" },
  ],
  emails: ["njdrivingschool@outlook.com"],
};
