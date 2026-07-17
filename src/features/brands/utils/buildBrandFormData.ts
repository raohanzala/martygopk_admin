import { appendFiles, appendIfExists } from "@/utils/formDataBuilder";
import type { BrandFormValues } from "../types/brand.types";

export interface BrandFormFiles {
  logo?: File | null;
}

export function buildBrandFormData(
  values: BrandFormValues,
  files: BrandFormFiles
): FormData {
  const formData = new FormData();

  appendIfExists(formData, "name", values.name.trim());
  const slug = values.slug?.trim();
  if (slug) appendIfExists(formData, "slug", slug);
  appendIfExists(formData, "isActive", values.isActive);
  appendIfExists(formData, "order", values.order);
  appendIfExists(formData, "showOnHomePage", values.showOnHomePage);

  appendFiles(formData, "logo", files.logo ? [files.logo] : undefined);

  return formData;
}
