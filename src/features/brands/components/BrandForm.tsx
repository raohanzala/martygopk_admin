import { Formik, Form } from 'formik';
import { useRef, useState } from 'react';
import { brandSchema } from '@/validation';
import { Button, Card, Input, Checkbox } from '@/components';
import type { BrandFormValues } from '../types/brand.types';
import type { Brand } from '@/api/brands';
import { buildBrandFormData } from '../utils/buildBrandFormData';
import { IoImageOutline, IoClose } from 'react-icons/io5';

interface BrandFormProps {
  brandToEdit?: Brand | null;
  onSubmit: (values: BrandFormValues, formData: FormData) => void;
  isSubmitting: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({
  brandToEdit,
  onSubmit,
  isSubmitting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    brandToEdit?.logo || null
  );

  const initialValues: BrandFormValues = {
    name: brandToEdit?.name || '',
    slug: brandToEdit?.slug || '',
    isActive: brandToEdit?.isActive ?? true,
    order: brandToEdit?.order ?? 0,
    showOnHomePage: brandToEdit?.showOnHomePage ?? false,
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(brandToEdit?.logo || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getLogoUrl = (logo: string) => {
    if (!logo) return null;
    if (logo.startsWith('data:') || logo.startsWith('http')) return logo;
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return logo.startsWith('/') ? `${base}${logo}` : logo;
  };

  const handleSubmit = (values: BrandFormValues) => {
    const formData = buildBrandFormData(values, { logo: logoFile });
    onSubmit(values, formData);
  };

  const isCreate = !brandToEdit;

  return (
    <Formik<BrandFormValues>
      initialValues={initialValues}
      validationSchema={brandSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Basic Information">
              <div className="space-y-4">
                <Input
                  name="name"
                  label="Brand name"
                  placeholder="e.g. Rolex"
                  required
                />
                <Input
                  name="slug"
                  label="URL slug"
                  placeholder="e.g. rolex (optional — generated from name if empty)"
                />
                <p className="text-xs text-text-muted -mt-2">
                  Storefront: /products/brand/your-slug
                </p>
                <Input
                  name="order"
                  label="Display order"
                  type="number"
                  min={0}
                  placeholder="0"
                />
                <Checkbox
                  name="isActive"
                  label="Active (visible on storefront)"
                />
                <Checkbox
                  name="showOnHomePage"
                  label="Show on home page"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Logo">
              <div className="space-y-4">
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={getLogoUrl(logoPreview) || ''}
                      alt="Brand logo"
                      className="w-40 h-40 object-contain rounded border border-border bg-background p-2"
                    />
                    <button
                      type="button"
                      onClick={clearLogo}
                      className="absolute -top-2 -right-2 p-1 bg-error text-white rounded hover:bg-error/90"
                      aria-label="Remove logo"
                    >
                      <IoClose className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded cursor-pointer hover:bg-background transition-colors">
                    <IoImageOutline className="w-10 h-10 text-text-muted mb-2" />
                    <span className="text-sm text-text-muted mb-1">
                      Add brand logo
                    </span>
                    <span className="text-xs text-text-muted">
                      JPG, PNG (optional)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                )}
                {logoPreview && (
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace logo
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline">
            Discard
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isCreate ? 'Create brand' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default BrandForm;
