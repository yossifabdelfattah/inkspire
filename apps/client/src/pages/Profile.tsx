import { useEffect, useState } from 'react';
import { Badge, Button, Loader, Center, Alert, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getMyOrders } from '../services/orderService';
import type { Order } from '../services/orderService';
import * as S from './Profile.styled';

function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    let mounted = true;

    getMyOrders()
      .then((data) => {
        if (mounted) setOrders(data);
      })
      .catch(() => {
        if (mounted) setError('Failed to load order history');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError('Name cannot be empty.');
      return;
    }

    setNameError(null);
    setSavingName(true);
    try {
      await updateProfile(trimmed);
      setEditingName(false);
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Failed to update name.');
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEditName = () => {
    setNameInput(user?.name ?? '');
    setNameError(null);
    setEditingName(false);
  };

  return (
    <S.Page initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="main">
      <S.Container>
        <h1>My Profile</h1>

        <S.Card>
          <S.InfoRow>
            <S.Label>Name</S.Label>
            {editingName ? (
              <S.EditNameRow>
                <TextInput
                  value={nameInput}
                  onChange={(e) => setNameInput(e.currentTarget.value)}
                  aria-label="Edit name"
                  size="sm"
                  disabled={savingName}
                  error={nameError}
                />
                <Button size="sm" onClick={() => { void handleSaveName(); }} loading={savingName} aria-label="Save name">
                  Save
                </Button>
                <Button size="sm" variant="default" onClick={handleCancelEditName} disabled={savingName} aria-label="Cancel editing name">
                  Cancel
                </Button>
              </S.EditNameRow>
            ) : (
              <S.EditNameRow>
                <S.Value>{user?.name || '—'}</S.Value>
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => {
                    setNameInput(user?.name ?? '');
                    setEditingName(true);
                  }}
                  aria-label="Edit name"
                >
                  Edit
                </Button>
                {nameSaved && <Badge color="green" variant="light">Saved</Badge>}
              </S.EditNameRow>
            )}
          </S.InfoRow>
          <S.InfoRow>
            <S.Label>Email</S.Label>
            <S.Value>{user?.email}</S.Value>
          </S.InfoRow>
          <S.InfoRow>
            <S.Label>Role</S.Label>
            <S.Value>
              <Badge color={user?.role === 'admin' ? 'indigo' : 'gray'} variant="light">
                {user?.role ?? 'user'}
              </Badge>
            </S.Value>
          </S.InfoRow>

          <S.InfoRow>
            <S.Label />
            <Button color="red" variant="light" onClick={handleLogout} aria-label="Log out">
              Log out
            </Button>
          </S.InfoRow>
        </S.Card>

        <S.Card>
          <h2>Order History</h2>

          {loading ? (
            <Center py="lg" role="status" aria-live="polite" aria-label="Loading orders">
              <Loader />
            </Center>
          ) : error ? (
            <Alert color="red" role="alert">{error}</Alert>
          ) : orders.length === 0 ? (
            <S.Empty>You haven't placed any orders yet.</S.Empty>
          ) : (
            <S.OrderList aria-live="polite">
              {orders.map((order) => (
                <S.OrderCard key={order._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <S.OrderHeader>
                    <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                    <Badge color="indigo" variant="light">{order.status}</Badge>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </S.OrderHeader>
                  <S.OrderItems>
                    {order.orderItems.map((item) => (
                      <li key={item.product}>
                        {item.title} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </S.OrderItems>
                </S.OrderCard>
              ))}
            </S.OrderList>
          )}
        </S.Card>
      </S.Container>
    </S.Page>
  );
}

export default Profile;
