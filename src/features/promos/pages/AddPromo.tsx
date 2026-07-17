import React from 'react';
import { useNavigate } from 'react-router-dom';
import PromoForm from '../components/PromoForm';
import { useAddPromo } from '../hooks/useAddPromo';

const AddPromo: React.FC = () => {
  const navigate = useNavigate();
  const { addPromoMutation, isAddingPromo } = useAddPromo();

  const handleSubmit = (data: Partial<import('@/api/promos').Promo>) => {
    addPromoMutation(data).then(() => navigate('/promos'));
  };

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
          Add promo code
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Create a new discount code for customers
        </p>
      </div>

      <PromoForm
        onSubmit={handleSubmit}
        isSubmitting={isAddingPromo}
      />
    </div>
  );
};

export default AddPromo;
