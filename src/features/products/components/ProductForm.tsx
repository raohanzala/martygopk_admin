import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components";
import Form from "@/components/form/Form";
import {
  ProductFormProvider,
  useProductFormContext,
} from "../context/ProductFormContext";
import { buildProductFormData } from "../utils/buildProductFormData";
import {
  getProductImageUrls,
  mapProductToFormValues,
} from "../utils/mapProductToFormValues";
import {
  addProductSchema,
  PRODUCT_FORM_DEFAULTS,
  type ProductFormValues,
} from "../validation/product.validation";
import type { Product } from "../types/product.types";
import ProductMainSection from "./form-sections/ProductMainSection";
import ProductMediaSection from "./form-sections/ProductMediaSection";
import ProductSidebar from "./form-sections/ProductSidebar";
import SpecificationsSection from "./form-sections/SpecificationsSection";
import VariantsSection from "./form-sections/VariantsSection";
import { useNavigate } from "react-router-dom";

interface ProductFormProps {
  initialValues?: Product | null;
  onSubmit: (values: ProductFormValues, formData: FormData) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

function ProductFormInner({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: ProductFormProps) {
  const { images } = useProductFormContext();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(addProductSchema) as Resolver<ProductFormValues>,
    defaultValues: PRODUCT_FORM_DEFAULTS,
  });

  const navigate = useNavigate();

  const { reset } = methods;

  useEffect(() => {
    reset(mapProductToFormValues(initialValues));
  }, [initialValues, reset]);

  const handleSubmit = (values: ProductFormValues) => {
    onSubmit(values, buildProductFormData(values, images));
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
            Edit product
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Update product information
          </p>
        </div>

        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProductMainSection />
          <ProductMediaSection />
          <SpecificationsSection />
          <VariantsSection />
        </div>
        <ProductSidebar />
      </div>
    </Form>
  );
}

export default function ProductForm(props: ProductFormProps) {
  return (
    <ProductFormProvider
      initialImageUrls={getProductImageUrls(props.initialValues)}
    >
      <ProductFormInner {...props} />
    </ProductFormProvider>
  );
}
