// Property type definition for report and related pages
export interface Property {
  address: string;
  lotDp: string;
  access: string;
  hazard: { flood: string; bushfire: string; noise: string };
  safety: string;
  census: string;
}
