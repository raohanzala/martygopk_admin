import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { Table, TableSkeleton, Button, Badge, Card, Pagination, Modal } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { Product } from '@/api/products';
import { IoAdd, IoPencil, IoTrash, IoCopyOutline, IoSearchOutline, IoImageOutline } from 'react-icons/io5';

function getDiscountedPrice(price: number, discount = 0) {
  if (!discount || discount <= 0) return price;
  return Math.round(price - (price * discount) / 100);
}

function getProductImage(item: Product) {
  const url = item.images?.[0]?.url;
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002';
  return `${base}${url}`;
}

function availabilityVariant(availability: string): 'success' | 'error' | 'warning' | 'default' {
  const value = availability?.toLowerCase() || '';
  if (value.includes('out')) return 'error';
  if (value.includes('stock') || value.includes('available')) return 'success';
  if (value.includes('pre') || value.includes('limited')) return 'warning';
  return 'default';
}

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { products, pagination, isProductsLoading } = useProducts(debouncedSearch, page);
  const { deleteProductMutation, isDeletingProduct } = useDeleteProduct();

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedProduct) return;
    deleteProductMutation(selectedProduct._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedProduct(null);
      },
    });
  };

  const columns: TableColumn<Product>[] = [
    {
      key: 'image',
      header: 'Product',
      width: '320px',
      render: (item) => {
        const imageUrl = getProductImage(item);
        return (
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.images?.[0]?.alt || item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-muted">
                  <IoImageOutline className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-text-primary">{item.title}</p>
              <p className="mt-0.5 truncate text-xs text-text-muted">{item.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) =>
        item.category?.name ? (
          <span className="inline-flex max-w-[180px] truncate rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-text-secondary">
            {item.category.name}
          </span>
        ) : (
          <span className="text-sm text-text-muted">—</span>
        ),
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      render: (item) => {
        const final = getDiscountedPrice(item.price, item.discount);
        const hasDiscount = (item.discount ?? 0) > 0;
        return (
          <div className="text-right">
            <p className="font-semibold tabular-nums text-text-primary">
              PKR {final.toLocaleString()}
            </p>
            {hasDiscount && (
              <div className="mt-0.5 flex items-center justify-end gap-1.5">
                <span className="text-xs tabular-nums text-text-muted line-through">
                  PKR {Number(item.price).toLocaleString()}
                </span>
                <span className="rounded bg-error/10 px-1.5 py-0.5 text-[10px] font-semibold text-error">
                  -{item.discount}%
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'variants',
      header: 'Variants',
      align: 'center',
      render: (item) => (
        <span className="tabular-nums text-sm text-text-secondary">
          {item.variants?.length || 0}
        </span>
      ),
    },
    {
      key: 'availability',
      header: 'Availability',
      render: (item) => (
        <Badge variant={availabilityVariant(item.availability)} size="sm">
          {item.availability || 'Unknown'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '140px',
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/new?duplicate=${item._id}`);
            }}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background hover:text-primary"
            aria-label="Duplicate product"
            title="Duplicate"
          >
            <IoCopyOutline className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${item._id}/edit`);
            }}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background hover:text-primary"
            aria-label="Edit product"
            title="Edit"
          >
            <IoPencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-error/10 hover:text-error"
            aria-label="Delete product"
            title="Delete"
          >
            <IoTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Products</h1>
          <p className="mt-1 text-sm text-text-muted">
            {pagination?.total != null
              ? `${pagination.total} product${pagination.total === 1 ? '' : 's'} in your catalog`
              : 'Manage your products and inventory'}
          </p>
        </div>
        <Button leftIcon={<IoAdd className="h-4 w-4" />} onClick={() => navigate('/products/new')}>
          Add product
        </Button>
      </div>

      <Card className="[&>div:last-child]:p-4">
        <div className="relative">
          <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </Card>

      <Card className="overflow-hidden [&>div:last-child]:p-0">
        {isProductsLoading ? (
          <TableSkeleton
            rowCount={8}
            columns={[
              { image: true, width: '320px' },
              {},
              { alignRight: true },
              {},
              {},
              { alignRight: true, width: '140px' },
            ]}
          />
        ) : (
          <>
            <Table
              data={products}
              columns={columns}
              onRowClick={(item) => navigate(`/products/${item._id}/edit`)}
              emptyMessage={
                debouncedSearch
                  ? `No products match “${debouncedSearch}”`
                  : 'No products yet'
              }
            />
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3.5">
                <p className="text-xs text-text-muted">
                  Page {pagination.page} of {pagination.pages}
                </p>
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

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (isDeletingProduct) return;
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete &ldquo;{selectedProduct?.title}&rdquo;? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedProduct(null);
              }}
              disabled={isDeletingProduct}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} isLoading={isDeletingProduct}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsList;
