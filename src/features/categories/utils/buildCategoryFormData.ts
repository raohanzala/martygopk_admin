import { appendFiles, appendIfExists } from "@/utils/formDataBuilder";
import type { CategoryFormValues } from "../types/category.types";

export interface CategoryFormFiles {
  image?: File | null;
}

export function buildCategoryFormData(
  values: CategoryFormValues,
  files: CategoryFormFiles
): FormData {
  const formData = new FormData();

  appendIfExists(formData, "name", values.name.trim());
  const slug = values.slug?.trim();
  if (slug) appendIfExists(formData, "slug", slug);
  appendIfExists(formData, "description", (values.description ?? "").trim());
  appendIfExists(formData, "isActive", values.isActive);
  appendIfExists(formData, "order", values.order);
  appendIfExists(formData, "showOnHomePage", values.showOnHomePage);

  appendFiles(formData, "image", files.image ? [files.image] : undefined);

  return formData;
}
