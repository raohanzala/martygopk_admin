import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PromoForm from '../components/PromoForm';
import { Spinner } from '@/components';
import { usePromo } from '../hooks/usePromo';
import { useUpdatePromo } from '../hooks/useUpdatePromo';
import type { Promo } from '@/api/promos';

const EditPromo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { promo, isPromoLoading } = usePromo(id || '');
  const { updatePromoMutation, isUpdatingPromo } = useUpdatePromo();

  const handleSubmit = (data: Partial<Promo>) => {
    if (!id) return;
    updatePromoMutation(
      { id, data },
      {
        onSuccess: () => {
          navigate('/promos');
        },
      }
    );
  };

  if (isPromoLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Promo not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/promos')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Promo codes
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">
          Edit promo code
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Update discount code settings
        </p>
      </div>

      <PromoForm
        promoToEdit={promo}
        onSubmit={handleSubmit}
        isSubmitting={isUpdatingPromo}
      />
    </div>
  );
};

export default EditPromo;
