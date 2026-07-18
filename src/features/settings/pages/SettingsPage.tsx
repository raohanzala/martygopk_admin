import { useEffect } from 'react';
import { useForm, useFormContext, type Path, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Spinner } from '@/components';
import Form from '@/components/form/Form';
import FormRowVertical from '@/components/form/FormRowVertical';
import Input from '@/components/form/Input';
import Textarea from '@/components/form/Textarea';
import Select from '@/components/form/Select';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import { useResetSettings } from '../hooks/useResetSettings';
import type { SettingsFormValues } from '../types/settings.types';
import {
  SETTINGS_FORM_DEFAULTS,
  settingsFormSchema,
} from '../validation/settings.validation';
import { cn } from '@/utils/cn';

const CURRENCY_OPTIONS = [
  { value: 'PKR', label: 'PKR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
];

function settingsToFormValues(
  settings: Record<string, unknown> | null
): SettingsFormValues {
  if (!settings) return structuredClone(SETTINGS_FORM_DEFAULTS);

  const seo = settings.seo as Record<string, unknown> | undefined;
  const announcement = settings.announcement as Record<string, unknown> | undefined;
  const contact = settings.contact as Record<string, unknown> | undefined;
  const social = settings.social as Record<string, unknown> | undefined;
  const shipping = settings.shipping as Record<string, unknown> | undefined;
  const payment = settings.payment as Record<string, unknown> | undefined;
  const order = settings.order as Record<string, unknown> | undefined;

  const endDate = announcement?.endDate;
  const endDateStr =
    typeof endDate === 'string' && endDate
      ? endDate.slice(0, 10)
      : endDate instanceof Date
        ? endDate.toISOString().slice(0, 10)
        : '';

  return {
    siteName: String(settings.siteName ?? ''),
    currency: String(settings.currency ?? 'PKR'),
    seo: {
      metaTitle: String(seo?.metaTitle ?? ''),
      metaDescription: String(seo?.metaDescription ?? ''),
      metaKeywords: Array.isArray(seo?.metaKeywords)
        ? (seo.metaKeywords as string[]).join(', ')
        : String(seo?.metaKeywords ?? ''),
    },
    announcement: {
      isActive: Boolean(announcement?.isActive ?? false),
      title: String(announcement?.title ?? ''),
      description: String(announcement?.description ?? ''),
      endDate: endDateStr,
      backgroundColor: String(announcement?.backgroundColor ?? '#D4AF37'),
      textColor: String(announcement?.textColor ?? '#000000'),
      discountPercentage: Number(announcement?.discountPercentage ?? 0),
    },
    contact: {
      supportEmail: String(contact?.supportEmail ?? ''),
      supportPhone: String(contact?.supportPhone ?? ''),
      whatsappNumber: String(contact?.whatsappNumber ?? ''),
      whatsappChannel: String(contact?.whatsappChannel ?? ''),
    },
    social: {
      facebook: String(social?.facebook ?? ''),
      instagram: String(social?.instagram ?? ''),
      twitter: String(social?.twitter ?? ''),
      youtube: String(social?.youtube ?? ''),
      tiktok: String(social?.tiktok ?? ''),
      whatsapp: String(social?.whatsapp ?? ''),
      linkedin: String(social?.linkedin ?? ''),
    },
    shipping: {
      flatFee: Number(shipping?.flatFee ?? 300),
      freeShippingAbove: Number(shipping?.freeShippingAbove ?? 5000),
    },
    payment: {
      codEnabled: Boolean(payment?.codEnabled ?? true),
      cardEnabled: Boolean(payment?.cardEnabled ?? false),
    },
    order: {
      autoConfirm: Boolean(order?.autoConfirm ?? false),
      allowCancel: Boolean(order?.allowCancel ?? true),
    },
  };
}

function formValuesToApi(values: SettingsFormValues) {
  const keywords = values.seo.metaKeywords
    ? values.seo.metaKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  return {
    siteName: values.siteName,
    currency: values.currency,
    seo: {
      metaTitle: values.seo.metaTitle,
      metaDescription: values.seo.metaDescription,
      metaKeywords: keywords,
    },
    announcement: {
      isActive: values.announcement.isActive,
      title: values.announcement.title || undefined,
      description: values.announcement.description || undefined,
      endDate: values.announcement.endDate
        ? `${values.announcement.endDate}T23:59:59.000Z`
        : undefined,
      backgroundColor: values.announcement.backgroundColor,
      textColor: values.announcement.textColor,
      discountPercentage: values.announcement.discountPercentage ?? 0,
    },
    contact: {
      supportEmail: values.contact.supportEmail,
      supportPhone: values.contact.supportPhone,
      whatsappNumber: values.contact.whatsappNumber,
      whatsappChannel: values.contact.whatsappChannel || undefined,
    },
    social: {
      facebook: values.social.facebook || undefined,
      instagram: values.social.instagram || undefined,
      twitter: values.social.twitter || undefined,
      youtube: values.social.youtube || undefined,
      tiktok: values.social.tiktok || undefined,
      whatsapp: values.social.whatsapp || undefined,
      linkedin: values.social.linkedin || undefined,
    },
    shipping: {
      flatFee: values.shipping.flatFee,
      freeShippingAbove: values.shipping.freeShippingAbove,
    },
    payment: {
      codEnabled: values.payment.codEnabled,
      cardEnabled: values.payment.cardEnabled,
    },
    order: {
      autoConfirm: values.order.autoConfirm,
      allowCancel: values.order.allowCancel,
    },
  };
}

function CheckboxField({
  name,
  label,
  helperText,
}: {
  name: Path<SettingsFormValues>;
  label: string;
  helperText?: string;
}) {
  const { register } = useFormContext<SettingsFormValues>();

  return (
    <div className="w-full">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          {...register(name)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
        />
        <span className="text-sm font-medium text-text-primary">{label}</span>
      </label>
      {helperText && (
        <p className={cn('mt-1 text-xs text-text-muted')}>{helperText}</p>
      )}
    </div>
  );
}

function SettingsForm({
  initialValues,
  isUpdating,
  onSubmit,
}: {
  initialValues: SettingsFormValues;
  isUpdating: boolean;
  onSubmit: (values: SettingsFormValues) => void;
}) {
  const methods = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema) as Resolver<SettingsFormValues>,
    defaultValues: SETTINGS_FORM_DEFAULTS,
  });

  const { reset } = methods;

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
      disabled={isUpdating}
      className="space-y-6"
    >
      <Card title="General" description="Site identity and currency">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormRowVertical label="Site Name" name="siteName" required>
            <Input name="siteName" placeholder="Luxury Watches" />
          </FormRowVertical>
          <FormRowVertical label="Currency" name="currency" required>
            <Select name="currency" options={CURRENCY_OPTIONS} />
          </FormRowVertical>
        </div>
      </Card>

      <Card
        title="Announcement bar"
        description="Top banner message and styling"
      >
        <div className="space-y-4">
          <CheckboxField
            name="announcement.isActive"
            label="Show announcement bar"
          />
          <FormRowVertical label="Title" name="announcement.title">
            <Input
              name="announcement.title"
              placeholder="e.g. Limited time offer"
            />
          </FormRowVertical>
          <FormRowVertical label="Description" name="announcement.description">
            <Input
              name="announcement.description"
              placeholder="e.g. 50% OFF on All Watches!"
            />
          </FormRowVertical>
          <FormRowVertical
            label="Discount % (optional)"
            name="announcement.discountPercentage"
          >
            <Input
              name="announcement.discountPercentage"
              type="number"
              min={0}
              max={100}
              step={1}
              placeholder="50"
            />
          </FormRowVertical>
          <FormRowVertical
            label="End date (optional)"
            name="announcement.endDate"
          >
            <Input name="announcement.endDate" type="date" />
          </FormRowVertical>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormRowVertical
              label="Background color"
              name="announcement.backgroundColor"
            >
              <Input
                name="announcement.backgroundColor"
                type="text"
                placeholder="#D4AF37"
              />
            </FormRowVertical>
            <FormRowVertical label="Text color" name="announcement.textColor">
              <Input
                name="announcement.textColor"
                type="text"
                placeholder="#000000"
              />
            </FormRowVertical>
          </div>
        </div>
      </Card>

      <Card title="SEO" description="Meta tags for search engines">
        <div className="space-y-4">
          <FormRowVertical label="Meta Title" name="seo.metaTitle">
            <Input
              name="seo.metaTitle"
              placeholder="Luxury Watches - Premium Timepieces"
            />
          </FormRowVertical>
          <FormRowVertical label="Meta Description" name="seo.metaDescription">
            <Textarea
              name="seo.metaDescription"
              rows={3}
              placeholder="Discover our collection of luxury watches"
            />
          </FormRowVertical>
          <FormRowVertical label="Meta Keywords" name="seo.metaKeywords">
            <Input
              name="seo.metaKeywords"
              placeholder="watches, luxury, timepieces (comma-separated)"
            />
          </FormRowVertical>
        </div>
      </Card>

      <Card
        title="Social links"
        description="URLs for social media (shown in footer etc.)"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormRowVertical label="Facebook URL" name="social.facebook">
            <Input name="social.facebook" placeholder="https://facebook.com/..." />
          </FormRowVertical>
          <FormRowVertical label="Instagram URL" name="social.instagram">
            <Input
              name="social.instagram"
              placeholder="https://instagram.com/..."
            />
          </FormRowVertical>
          <FormRowVertical label="Twitter / X URL" name="social.twitter">
            <Input name="social.twitter" placeholder="https://twitter.com/..." />
          </FormRowVertical>
          <FormRowVertical label="YouTube URL" name="social.youtube">
            <Input name="social.youtube" placeholder="https://youtube.com/..." />
          </FormRowVertical>
          <FormRowVertical label="TikTok URL" name="social.tiktok">
            <Input name="social.tiktok" placeholder="https://tiktok.com/..." />
          </FormRowVertical>
          <FormRowVertical
            label="WhatsApp (optional profile / link)"
            name="social.whatsapp"
          >
            <Input
              name="social.whatsapp"
              placeholder="https://wa.me/... (footer & social)"
            />
          </FormRowVertical>
          <FormRowVertical label="LinkedIn URL" name="social.linkedin">
            <Input
              name="social.linkedin"
              placeholder="https://linkedin.com/..."
            />
          </FormRowVertical>
        </div>
      </Card>

      <Card
        title="Contact"
        description="Support, WhatsApp chat number, and channel link for updates"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormRowVertical label="Support Email" name="contact.supportEmail">
            <Input
              name="contact.supportEmail"
              type="email"
              placeholder="support@example.com"
            />
          </FormRowVertical>
          <FormRowVertical label="Support Phone" name="contact.supportPhone">
            <Input
              name="contact.supportPhone"
              placeholder="+92 300 1234567"
            />
          </FormRowVertical>
          <FormRowVertical
            label="WhatsApp number (orders & chat)"
            name="contact.whatsappNumber"
          >
            <Input
              name="contact.whatsappNumber"
              placeholder="+92 300 1234567 — used for Order through WhatsApp"
            />
          </FormRowVertical>
          <FormRowVertical
            label="WhatsApp channel URL"
            name="contact.whatsappChannel"
          >
            <Input
              name="contact.whatsappChannel"
              placeholder="https://whatsapp.com/channel/... or invite link"
            />
          </FormRowVertical>
        </div>
      </Card>

      <Card title="Shipping" description="Shipping fees and thresholds">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormRowVertical label="Flat Fee" name="shipping.flatFee">
            <Input
              name="shipping.flatFee"
              type="number"
              min={0}
              step={1}
              placeholder="300"
            />
          </FormRowVertical>
          <FormRowVertical
            label="Free Shipping Above"
            name="shipping.freeShippingAbove"
          >
            <Input
              name="shipping.freeShippingAbove"
              type="number"
              min={0}
              step={1}
              placeholder="5000"
            />
          </FormRowVertical>
        </div>
      </Card>

      <Card title="Payment" description="Payment method options">
        <div className="space-y-4">
          <CheckboxField
            name="payment.codEnabled"
            label="Enable Cash on Delivery (COD)"
          />
          <CheckboxField
            name="payment.cardEnabled"
            label="Enable Card Payment"
          />
        </div>
      </Card>

      <Card title="Order" description="Order processing settings">
        <div className="space-y-4">
          <CheckboxField
            name="order.autoConfirm"
            label="Auto-confirm orders"
            helperText="Orders will be confirmed automatically"
          />
          <CheckboxField
            name="order.allowCancel"
            label="Allow order cancellation"
            helperText="Customers can cancel orders before shipping"
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="submit" isLoading={isUpdating}>
          Save settings
        </Button>
      </div>
    </Form>
  );
}

export default function SettingsPage() {
  const { settings, isSettingsLoading } = useSettings();
  const { updateSettingsMutation, isUpdating } = useUpdateSettings();
  const { resetSettingsMutation, isResetting } = useResetSettings();

  if (isSettingsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const initialValues = settingsToFormValues(
    (settings as Record<string, unknown> | null) ?? null
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage your store settings
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => resetSettingsMutation()}
          isLoading={isResetting}
        >
          Reset to defaults
        </Button>
      </div>

      <SettingsForm
        initialValues={initialValues}
        isUpdating={isUpdating}
        onSubmit={(values) => {
          updateSettingsMutation(formValuesToApi(values));
        }}
      />
    </div>
  );
}
