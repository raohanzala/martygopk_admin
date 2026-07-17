import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input, Textarea, Select, Checkbox, Button, Card } from '@/components';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import { useResetSettings } from '../hooks/useResetSettings';
import { Spinner } from '@/components';
import type { SettingsFormValues } from '../types/settings.types';

const settingsSchema = Yup.object({
  siteName: Yup.string().required('Site name is required'),
  currency: Yup.string().required('Currency is required'),
});

const defaultSocial = {
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  tiktok: '',
  whatsapp: '',
  linkedin: '',
};

const defaultAnnouncement = {
  isActive: false,
  title: '',
  description: '',
  endDate: '',
  backgroundColor: '#D4AF37',
  textColor: '#000000',
  discountPercentage: 0,
};

function settingsToFormValues(settings: Record<string, unknown> | null): SettingsFormValues {
  if (!settings) {
    return {
      siteName: '',
      currency: 'PKR',
      seo: {
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      },
      announcement: { ...defaultAnnouncement },
      contact: {
        supportEmail: '',
        supportPhone: '',
        whatsappNumber: '',
        whatsappChannel: '',
      },
      social: { ...defaultSocial },
      shipping: {
        flatFee: 300,
        freeShippingAbove: 5000,
      },
      payment: {
        codEnabled: true,
        cardEnabled: false,
      },
      order: {
        autoConfirm: false,
        allowCancel: true,
      },
    };
  }

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
    ? values.seo.metaKeywords.split(',').map((k) => k.trim()).filter(Boolean)
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
      endDate: values.announcement.endDate ? `${values.announcement.endDate}T23:59:59.000Z` : undefined,
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

export default function SettingsPage() {
  const { settings, isSettingsLoading } = useSettings();
  const { updateSettingsMutation, isUpdating } = useUpdateSettings();
  const { resetSettingsMutation, isResetting } = useResetSettings();

  if (isSettingsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const initialValues = settingsToFormValues(settings ?? null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Settings
          </h1>
          <p className="text-sm text-text-muted mt-1">
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

      <Formik
        initialValues={initialValues}
        validationSchema={settingsSchema}
        onSubmit={(values) => {
          updateSettingsMutation(formValuesToApi(values));
        }}
        enableReinitialize
      >
        <Form className="space-y-6">
          {/* General */}
          <Card title="General" description="Site identity and currency">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="siteName"
                label="Site Name"
                placeholder="Luxury Watches"
                required
              />
              <Select
                name="currency"
                label="Currency"
                options={[
                  { value: 'PKR', label: 'PKR' },
                  { value: 'USD', label: 'USD' },
                  { value: 'EUR', label: 'EUR' },
                  { value: 'GBP', label: 'GBP' },
                ]}
              />
            </div>
          </Card>

          {/* Announcement bar */}
          <Card
            title="Announcement bar"
            description="Top banner message and styling"
          >
            <div className="space-y-4">
              <Checkbox
                name="announcement.isActive"
                label="Show announcement bar"
              />
              <Input
                name="announcement.title"
                label="Title"
                placeholder="e.g. Limited time offer"
              />
              <Input
                name="announcement.description"
                label="Description"
                placeholder="e.g. 50% OFF on All Watches!"
              />
              <Input
                name="announcement.discountPercentage"
                label="Discount % (optional)"
                type="number"
                min={0}
                max={100}
                step={1}
                placeholder="50"
              />
              <Input
                name="announcement.endDate"
                label="End date (optional)"
                type="date"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="announcement.backgroundColor"
                  label="Background color"
                  type="text"
                  placeholder="#D4AF37"
                />
                <Input
                  name="announcement.textColor"
                  label="Text color"
                  type="text"
                  placeholder="#000000"
                />
              </div>
            </div>
          </Card>

          {/* SEO */}
          <Card
            title="SEO"
            description="Meta tags for search engines"
          >
            <div className="space-y-4">
              <Input
                name="seo.metaTitle"
                label="Meta Title"
                placeholder="Luxury Watches - Premium Timepieces"
              />
              <Textarea
                name="seo.metaDescription"
                label="Meta Description"
                rows={3}
                placeholder="Discover our collection of luxury watches"
              />
              <Input
                name="seo.metaKeywords"
                label="Meta Keywords"
                placeholder="watches, luxury, timepieces (comma-separated)"
              />
            </div>
          </Card>

          {/* Social links */}
          <Card
            title="Social links"
            description="URLs for social media (shown in footer etc.)"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="social.facebook"
                label="Facebook URL"
                placeholder="https://facebook.com/..."
              />
              <Input
                name="social.instagram"
                label="Instagram URL"
                placeholder="https://instagram.com/..."
              />
              <Input
                name="social.twitter"
                label="Twitter / X URL"
                placeholder="https://twitter.com/..."
              />
              <Input
                name="social.youtube"
                label="YouTube URL"
                placeholder="https://youtube.com/..."
              />
              <Input
                name="social.tiktok"
                label="TikTok URL"
                placeholder="https://tiktok.com/..."
              />
              <Input
                name="social.whatsapp"
                label="WhatsApp (optional profile / link)"
                placeholder="https://wa.me/... (footer & social)"
              />
              <Input
                name="social.linkedin"
                label="LinkedIn URL"
                placeholder="https://linkedin.com/..."
              />
            </div>
          </Card>

          {/* Contact */}
          <Card
            title="Contact"
            description="Support, WhatsApp chat number, and channel link for updates"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="contact.supportEmail"
                label="Support Email"
                type="email"
                placeholder="support@example.com"
              />
              <Input
                name="contact.supportPhone"
                label="Support Phone"
                placeholder="+92 300 1234567"
              />
              <Input
                name="contact.whatsappNumber"
                label="WhatsApp number (orders & chat)"
                placeholder="+92 300 1234567 — used for Order through WhatsApp"
              />
              <Input
                name="contact.whatsappChannel"
                label="WhatsApp channel URL"
                placeholder="https://whatsapp.com/channel/... or invite link"
              />
            </div>
          </Card>

          {/* Shipping */}
          <Card
            title="Shipping"
            description="Shipping fees and thresholds"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="shipping.flatFee"
                label="Flat Fee"
                type="number"
                min={0}
                step={1}
                placeholder="300"
              />
              <Input
                name="shipping.freeShippingAbove"
                label="Free Shipping Above"
                type="number"
                min={0}
                step={1}
                placeholder="5000"
              />
            </div>
          </Card>

          {/* Payment */}
          <Card
            title="Payment"
            description="Payment method options"
          >
            <div className="space-y-4">
              <Checkbox
                name="payment.codEnabled"
                label="Enable Cash on Delivery (COD)"
              />
              <Checkbox
                name="payment.cardEnabled"
                label="Enable Card Payment"
              />
            </div>
          </Card>

          {/* Order */}
          <Card
            title="Order"
            description="Order processing settings"
          >
            <div className="space-y-4">
              <Checkbox
                name="order.autoConfirm"
                label="Auto-confirm orders"
                helperText="Orders will be confirmed automatically"
              />
              <Checkbox
                name="order.allowCancel"
                label="Allow order cancellation"
                helperText="Customers can cancel orders before shipping"
              />
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="submit" isLoading={isUpdating}>
              Save settings
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
