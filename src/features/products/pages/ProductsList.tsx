import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { Table, TableSkeleton, Button, Badge, Card, Pagination } from '@/components';
import type { TableColumn } from '@/components/Table';
import { IoAdd, IoPencil, IoTrash, IoCopyOutline } from 'react-icons/io5';
import { Modal } from '@/components';

interface ProductVariant {
  _id: string;
  price: number;
  finalPrice?: number;
  discountPercentage?: number;
  isDefault?: boolean;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  status: string;
  categories?: { name: string; _id?: string }[];
  brandId?: {
    name: string;
  };
  images: {
    main: string;
  };
  variants?: ProductVariant[];
}

function getProductDisplayPrice(item: Product): { final: number; original?: number; hasDiscount: boolean } {
  const vars = item.variants || [];
  const defaultV = vars.find((v) => v.isDefault) || vars[0];
  if (!defaultV) return { final: 0, hasDiscount: false };
  const final = defaultV.finalPrice ?? defaultV.price ?? 0;
  const original = defaultV.price;
  const hasDiscount = (defaultV.discountPercentage ?? 0) > 0;
  return { final, original: hasDiscount ? original : undefined, hasDiscount };
}

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { products, pagination, isProductsLoading } = useProducts(search, page);
  const { deleteProductMutation, isDeletingProduct } = useDeleteProduct();

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProductMutation(selectedProduct._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        },
        onError: (error) => {
          console.error(error);
        },
      });
      // setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const columns: TableColumn<Product>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (item) => (
        <img
          src={item.images?.main || '/placeholder.png'}
          alt={item.name}
          className="w-12 h-12 object-cover rounded"
        />
      ),
      width: '80px',
    },
    {
      key: 'name',
      header: 'Product',
      render: (item) => (
        <div>
          <p className="font-medium text-text-primary">{item.name}</p>
          <p className="text-xs text-text-muted">{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'categories',
      header: 'Category',
      render: (item) => (
        <span className="text-sm text-text-secondary">
          {item.categories?.length
            ? item.categories.map((c) => c.name).join(', ')
            : '-'}
        </span>
      ),
    },
    {
      key: 'brandId',
      header: 'Brand',
      render: (item) => (
        <span className="text-sm text-text-secondary">
          {item.brandId?.name || '-'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      render: (item) => {
        const { final, original, hasDiscount } = getProductDisplayPrice(item);
        return (
          <div className="text-right">
            <p className="font-medium text-text-primary">
              PKR {final.toLocaleString()}
            </p>
            {hasDiscount && original != null && (
              <p className="text-xs text-text-muted line-through">
                PKR {original.toLocaleString()}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const statusConfig = {
          active: { label: 'Active', variant: 'success' as const },
          draft: { label: 'Draft', variant: 'default' as const },
          out_of_stock: { label: 'Out of Stock', variant: 'error' as const },
        };
        const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.draft;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/new?duplicate=${item._id}`);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
            aria-label="Duplicate product"
            title="Duplicate product"
          >
            <IoCopyOutline className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${item._id}/edit`);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
            aria-label="Edit product"
          >
            <IoPencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-error transition-colors"
            aria-label="Delete product"
          >
            <IoTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Products</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your products and inventory
          </p>
        </div>
          <Button
            leftIcon={<IoAdd className="w-4 h-4" />}
            onClick={() => navigate('/products/new')}
          >
            Add product
          </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm h-9 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        {isProductsLoading ? (
          <TableSkeleton
            rowCount={8}
            columns={[
              { image: true, width: '80px' },
              {},
              {},
              {},
              { alignRight: true },
              {},
              { alignRight: true },
            ]}
          />
        ) : (
          <>
            <Table
              data={products || []}
              columns={columns}
              onRowClick={(item) => navigate(`/products/${item._id}/edit`)}
            />
            {pagination && pagination.pages > 1 && (
              <div className="px-5 py-4 border-t border-border">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={isDeletingProduct}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsList;
