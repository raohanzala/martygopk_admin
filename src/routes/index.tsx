import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LoginPage } from '@/features/auth';
import { ProductsList, AddProduct, EditProduct } from '@/features/products/pages';
import { CategoriesList, AddCategory, EditCategory } from '@/features/categories/pages';
import { BrandsList, AddBrand, EditBrand } from '@/features/brands/pages';
import { UsersList, AddUser, EditUser } from '@/features/users/pages';
import { BlogsList, AddBlog, EditBlog } from '@/features/blog/pages';
import { ReviewsList } from '@/features/reviews';
import { NotificationsList } from '@/features/notification';
import { SubscribersList } from '@/features/newsletter';
import { SettingsPage } from '@/features/settings';
import { OrdersList, OrderDetail } from '@/features/orders';
import { DashboardPage } from '@/features/dashboard';
import { PromosList, AddPromo, EditPromo } from '@/features/promos/pages';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductsList />,
          },
          {
            path: 'new',
            element: <AddProduct />,
          },
          {
            path: ':id/edit',
            element: <EditProduct />,
          },
        ],
      },
      {
        path: 'categories',
        children: [
          {
            index: true,
            element: <CategoriesList />,
          },
          {
            path: 'new',
            element: <AddCategory />,
          },
          {
            path: ':id/edit',
            element: <EditCategory />,
          },
        ],
      },
      {
        path: 'brands',
        children: [
          {
            index: true,
            element: <BrandsList />,
          },
          {
            path: 'new',
            element: <AddBrand />,
          },
          {
            path: ':id/edit',
            element: <EditBrand />,
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <UsersList />,
          },
          {
            path: 'new',
            element: <AddUser />,
          },
          {
            path: ':id/edit',
            element: <EditUser />,
          },
        ],
      },
      {
        path: 'blogs',
        children: [
          {
            index: true,
            element: <BlogsList />,
          },
          {
            path: 'new',
            element: <AddBlog />,
          },
          {
            path: ':id/edit',
            element: <EditBlog />,
          },
        ],
      },
      {
        path: 'reviews',
        element: <ReviewsList />,
      },
      {
        path: 'orders',
        children: [
          {
            index: true,
            element: <OrdersList />,
          },
          {
            path: ':id',
            element: <OrderDetail />,
          },
        ],
      },
      {
        path: 'promos',
        children: [
          {
            index: true,
            element: <PromosList />,
          },
          {
            path: 'new',
            element: <AddPromo />,
          },
          {
            path: ':id/edit',
            element: <EditPromo />,
          },
        ],
      },
      {
        path: 'newsletter',
        element: <SubscribersList />,
      },
      {
        path: 'notifications',
        element: <NotificationsList />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
