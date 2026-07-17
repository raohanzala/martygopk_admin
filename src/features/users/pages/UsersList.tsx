import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { Table, TableSkeleton, Button, Badge, Card, Modal } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { User } from '@/api/users';
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const roleParam =
    roleFilter === 'all' ? undefined : (roleFilter as 'user' | 'admin');

  const { users, isUsersLoading } = useUsers({
    search: search || undefined,
    role: roleParam,
  });
  const { deleteUserMutation, isDeletingUser } = useDeleteUser();

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation(selectedUser._id);
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => (
        <p className="font-medium text-text-primary">{item.name}</p>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (item) => (
        <p className="text-text-secondary text-sm">{item.email}</p>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (item) => (
        <Badge variant={item.role === 'admin' ? 'info' : 'default'}>
          {item.role}
        </Badge>
      ),
    },
    {
      key: 'provider',
      header: 'Sign-in',
      render: (item) => (
        <span className="text-sm text-text-muted">
          {item.provider === 'google' ? 'Google' : 'Email'}
        </span>
      ),
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
              navigate(`/users/${item._id}/edit`);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
            aria-label="Edit user"
          >
            <IoPencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-error transition-colors"
            aria-label="Delete user"
          >
            <IoTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Users
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage admin and customer accounts
          </p>
        </div>
        <Button
          leftIcon={<IoAdd className="w-4 h-4" />}
          onClick={() => navigate('/users/new')}
        >
          Add user
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm h-9 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'user', 'admin'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRoleFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  roleFilter === filter
                    ? 'bg-primary text-secondary'
                    : 'bg-background text-text-secondary hover:bg-background/80'
                }`}
              >
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        {isUsersLoading ? (
          <TableSkeleton
            rowCount={10}
            columns={[{}, {}, {}, {}, { alignRight: true }]}
          />
        ) : (
          <Table
            data={users}
            columns={columns}
            onRowClick={(item) => navigate(`/users/${item._id}/edit`)}
          />
        )}
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Delete user"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete &quot;{selectedUser?.name}&quot; (
            {selectedUser?.email})? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={isDeletingUser}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersList;
