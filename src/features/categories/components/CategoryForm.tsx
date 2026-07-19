import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Select } from "@/components";
import Form from "@/components/form/Form";
import FormRowVertical from "@/components/form/FormRowVertical";
import Input from "@/components/form/Input";
import Textarea from "@/components/form/Textarea";
import { getAllCategoriesApi, type Category } from "@/api/categories";
import type { ProductImage } from "@/features/products/components/ProductImagesCard";
import type { CategoryFormValues } from "../types/category.types";
import {
  CATEGORY_FORM_DEFAULTS,
  categoryFormSchema,
} from "../validation/category.validation";
import { buildCategoryFormData } from "../utils/buildCategoryFormData";
import CategoryImageCard from "./CategoryImageCard";

function getCategoryImageUrl(image: Category["image"]): string | null {
  if (!image) return null;
  if (typeof image === "string") {
    if (!image) return null;
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    const base =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:3002";
    return `${base}${image}`;
  }
  if (image.url) {
    if (image.url.startsWith("http") || image.url.startsWith("data:"))
      return image.url;
    const base =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:3002";
    return `${base}${image.url}`;
  }
  return null;
}

function mapCategoryToFormValues(
  category?: Category | null,
): CategoryFormValues {
  if (!category) return CATEGORY_FORM_DEFAULTS;
  return {
    name: category.name || "",
    slug: category.slug || "",
    description: category.description || "",
    parentCategory:
      typeof category.parentCategory === "string"
        ? category.parentCategory
        : "",
    isActive: category.isActive ?? true,
    isFeatured: category.isFeatured ?? false,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface CategoryFormProps {
  categoryToEdit?: Category | null;
  onSubmit: (values: CategoryFormValues, formData: FormData) => void;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryToEdit,
  onSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();
  const isCreate = !categoryToEdit;

  const [image, setImage] = useState<ProductImage | null>(() => {
    const url = getCategoryImageUrl(categoryToEdit?.image);
    return url ? { id: "existing", preview: url } : null;
  });
  const [imageError, setImageError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(categoryToEdit?.slug));

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as Resolver<CategoryFormValues>,
    defaultValues: CATEGORY_FORM_DEFAULTS,
  });

  const { reset, watch, setValue, register } = methods;
  const nameValue = watch("name");

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories-all"],
    queryFn: getAllCategoriesApi,
  });

  const parentOptions = useMemo(
    () => allCategories.filter((c) => c._id !== categoryToEdit?._id),
    [allCategories, categoryToEdit?._id],
  );

  useEffect(() => {
    reset(mapCategoryToFormValues(categoryToEdit));
    const url = getCategoryImageUrl(categoryToEdit?.image);
    setImage(url ? { id: "existing", preview: url } : null);
    setSlugTouched(Boolean(categoryToEdit?.slug));
    setImageError("");
  }, [categoryToEdit, reset]);

  useEffect(() => {
    if (!slugTouched && isCreate && nameValue) {
      setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }, [nameValue, slugTouched, isCreate, setValue]);

  const handleSubmit = (values: CategoryFormValues) => {
    if (isCreate && !image?.file) {
      setImageError("Category image is required");
      return;
    }
    setImageError("");
    onSubmit(
      values,
      buildCategoryFormData(values, { image: image?.file ?? null }),
    );
  };

  return (
    <Form
      methods={methods}
      onSubmit={handleSubmit}
      disabled={isSubmitting}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Add category
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Create a new product category
          </p>
        </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/categories")}
          disabled={isSubmitting}
          >
          Discard
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isCreate && !image}
          >
          {isCreate ? "Create category" : "Save changes"}
        </Button>
          </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Basic Information">
            <div className="space-y-4">
              <FormRowVertical label="Category name" name="name" required>
                <Input name="name" placeholder="e.g. Luxury Watches" />
              </FormRowVertical>

              <FormRowVertical
                label="URL slug"
                name="slug"
                required
                helperText="Storefront: /products/category/your-slug"
              >
                <Input
                  name="slug"
                  placeholder="e.g. luxury-watches"
                  onFocus={() => setSlugTouched(true)}
                />
              </FormRowVertical>

              <FormRowVertical label="Description" name="description">
                <Textarea
                  name="description"
                  rows={4}
                  placeholder="Brief description of this category"
                />
              </FormRowVertical>

              <FormRowVertical label="Parent category" name="parentCategory">
                <Select
                name="parentCategory"
                options={parentOptions.map((c) => ({
                  value: c._id,
                  label: c.name,
                }))}
                placeholder="Select a parent category"
                />
              </FormRowVertical>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <CategoryImageCard
            image={image}
            onImageChange={(next) => {
              setImage(next);
              if (next) setImageError("");
            }}
            required={isCreate}
            error={imageError}
          />
          <Card title="Visibility">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-sm font-medium text-text-primary">
                  Active (visible on storefront)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-sm font-medium text-text-primary">
                  Featured category
                </span>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </Form>
  );
};

export default CategoryForm;
