import { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import {
  searchClient,
  createSale,
<<<<<<< HEAD
  fetchWarehouses,
  fetchPayboxes,
  fetchOrganizations,
=======
  fetchPayboxes,
  fetchOrganizations,
  fetchWarehouses,
>>>>>>> 1b77ed7 (fix: use real contragent search)
  fetchPriceTypes,
  fetchNomenclature,
} from '../utils/api';
import SelectModal from './SelectModal';

interface SelectOption {
  id: number;
  name: string;
}

interface ProductWithPrice extends SelectOption {
  price: number;
}

export default function OrderForm() {
  const {
    token,
    client,
    selectedAccount,
    selectedOrganization,
    selectedWarehouse,
    selectedPriceType,
    cart,
    setClient,
    setSelectedAccount,
    setSelectedOrganization,
    setSelectedWarehouse,
    setSelectedPriceType,
    addToCart,
    updateCartItem,
    removeFromCart,
    logout,
  } = useStore();

  const [phone, setPhone] = useState('');
  const [loadingClient, setLoadingClient] = useState(false);
  const [clientError, setClientError] = useState('');

  const [accounts, setAccounts] = useState<SelectOption[]>([]);
  const [organizations, setOrganizations] = useState<SelectOption[]>([]);
  const [warehouses, setWarehouses] = useState<SelectOption[]>([]);
  const [priceTypes, setPriceTypes] = useState<SelectOption[]>([]);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showOrganizationModal, setShowOrganizationModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showPriceTypeModal, setShowPriceTypeModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);

  const [productSearch, setProductSearch] = useState('');
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const payboxesData = await fetchPayboxes(token);
        const payboxesArray = Array.isArray(payboxesData) ? payboxesData : (payboxesData?.result || []);
        setAccounts(payboxesArray.map((item: { id?: number; pk?: number; name?: string; title?: string }) => ({
          id: item.id || item.pk || 0,
          name: item.name || item.title || String(item.id || item.pk || ''),
        })));
      } catch (error) {
        console.error('Ошибка загрузки счетов:', error);
      }

      try {
        const orgsData = await fetchOrganizations(token);
        const orgsArray = Array.isArray(orgsData) ? orgsData : (orgsData?.result || []);
        setOrganizations(orgsArray.map((item: { id?: number; pk?: number; short_name?: string; full_name?: string; name?: string }) => ({
          id: item.id || item.pk || 0,
          name: item.short_name || item.full_name || item.name || String(item.id || item.pk || ''),
        })));
      } catch (error) {
        console.error('Ошибка загрузки организаций:', error);
      }

      try {
        const warehousesData = await fetchWarehouses(token);
        const warehousesArray = Array.isArray(warehousesData) ? warehousesData : (warehousesData?.result || []);
        setWarehouses(warehousesArray.map((item: { id?: number; pk?: number; name?: string; title?: string }) => ({
          id: item.id || item.pk || 0,
          name: item.name || item.title || String(item.id || item.pk || ''),
        })));
      } catch (error) {
        console.error('Ошибка загрузки складов:', error);
      }

      try {
        const priceTypesData = await fetchPriceTypes(token);
        const priceTypesArray = Array.isArray(priceTypesData) ? priceTypesData : (priceTypesData?.result || []);
        setPriceTypes(priceTypesArray.map((item: { id?: number; pk?: number; name?: string; title?: string }) => ({
          id: item.id || item.pk || 0,
          name: item.name || item.title || String(item.id || item.pk || ''),
        })));
      } catch (error) {
        console.error('Ошибка загрузки типов цен:', error);
      }
<<<<<<< HEAD

=======
>>>>>>> 1b77ed7 (fix: use real contragent search)
    };

    loadData();
  }, [token]);

  const handleSearchClient = async () => {
    if (!phone.trim() || !token) return;

    setLoadingClient(true);
    setClientError('');

    try {
<<<<<<< HEAD
      const data = await searchClient(phone, token);
      const clientsData = Array.isArray(data) ? data : (data?.result || data?.results || []);
      const clients = Array.isArray(clientsData) ? clientsData : [];
=======
      const clients = await searchClient(phone, token);
>>>>>>> 1b77ed7 (fix: use real contragent search)
      if (clients.length > 0) {
        const foundClient = clients[0];
        const clientId = typeof foundClient === 'object' && foundClient !== null && 'id' in foundClient
          ? Number(foundClient.id)
          : 0;
        const clientName = typeof foundClient === 'object' && foundClient !== null
          ? String(
              (foundClient as { name?: string; full_name?: string; short_name?: string }).name ||
                (foundClient as { name?: string; full_name?: string; short_name?: string }).full_name ||
                (foundClient as { name?: string; full_name?: string; short_name?: string }).short_name ||
                'Клиент'
            )
          : 'Клиент';
        if (clientId > 0) {
          setClient({ id: clientId, name: clientName, phone });
        } else {
          setClientError('Клиент не найден');
          setClient(null);
        }
      } else {
        setClientError('Клиент не найден');
        setClient(null);
      }
    } catch (error) {
      console.error('Ошибка поиска клиента:', error);
      setClientError('Ошибка поиска клиента');
      setClient(null);
    } finally {
      setLoadingClient(false);
    }
  };

  const handleProductSearch = async (query: string) => {
<<<<<<< HEAD
    if (!token) return;
    if (!query.trim()) {
=======
    if (!query.trim() || !token) {
>>>>>>> 1b77ed7 (fix: use real contragent search)
      setProducts([]);
      return;
    }

    setLoadingProducts(true);
    try {
      const data = await fetchNomenclature(query, token);
      const list = Array.isArray(data) ? data : (data?.result || data?.results || []);
      const mapped: ProductWithPrice[] = list
        .map((item: {
          id?: number;
          pk?: number;
          name?: string;
          title?: string;
          prices?: Array<{ price?: number; price_type?: string | number | null }>;
        }) => {
          const itemId = Number(item.id || item.pk || 0);
          if (!itemId) {
            return null;
          }
          const priceEntry = Array.isArray(item.prices) && item.prices.length > 0
            ? (() => {
                if (selectedPriceType) {
                  const match = item.prices.find((p) =>
                    p?.price_type &&
                    (String(p.price_type) === String(selectedPriceType.id) ||
                      String(p.price_type).toLowerCase() === selectedPriceType.name.toLowerCase())
                  );
                  return match || item.prices[0];
                }
                return item.prices[0];
              })()
            : undefined;
          const priceValue = priceEntry?.price ?? 0;
          return {
            id: itemId,
            name: item.name || item.title || `Товар ${itemId}`,
            price: Number(priceValue) || 0,
          };
        })
        .filter(Boolean) as ProductWithPrice[];
      setProducts(mapped);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddProduct = (product: ProductWithPrice) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: productQuantities[product.id] || 1,
    });
    setProductQuantities({ ...productQuantities, [product.id]: 1 });
  };

  const handleCreateSale = async (status: 'draft' | 'done' = 'draft') => {
    if (!token) return;

    if (!selectedAccount || !selectedOrganization || !selectedWarehouse || !selectedPriceType) {
      setSubmitResult({ success: false, message: 'Заполните все обязательные поля' });
      return;
    }

    if (cart.length === 0) {
      setSubmitResult({ success: false, message: 'Добавьте товары' });
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const payload = {
        organization: selectedOrganization.id,
        warehouse: selectedWarehouse.id,
        goods: cart.map((p) => ({
          nomenclature: Number(p.id),
          quantity: p.qty,
          price: p.price,
        })),
        status: status === 'done',
        ...(client ? { contragent: client.id } : {}),
        ...(client?.name ? { contragent_name: client.name } : {}),
      };

      await createSale(payload, token);
      setSubmitResult({
        success: true,
        message: status === 'done' ? 'Продажа создана и проведена' : 'Продажа создана',
      });
    } catch (error) {
      let errorMessage = 'Ошибка создания продажи';
      if (error instanceof Error) {
        errorMessage = error.message;
        const errorDetails = (error as unknown as { details?: unknown }).details;
        void errorDetails;
      }
      setSubmitResult({
        success: false,
        message: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Создание заказа</h1>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Выйти
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Телефон клиента
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClient();
                  }
                }}
                placeholder="+7 (999) 999-99-99"
                className="flex-1 bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loadingClient}
              />
              <button
                onClick={handleSearchClient}
                disabled={loadingClient}
                className="bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 text-sm font-medium whitespace-nowrap disabled:opacity-50"
              >
                {loadingClient ? '...' : 'Найти'}
              </button>
            </div>
            {client && (
              <div className="mt-2 text-sm text-gray-700 font-medium">{client.name}</div>
            )}
            {clientError && (
              <div className="mt-2 text-sm text-red-600">{clientError}</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
            <button
              onClick={() => setShowAccountModal(true)}
              className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Счёт (тип продажи)</div>
                  <div className={`text-sm ${selectedAccount ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {selectedAccount?.name || 'Выберите счёт'}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setShowOrganizationModal(true)}
              className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Организация</div>
                  <div className={`text-sm ${selectedOrganization ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {selectedOrganization?.name || 'Выберите организацию'}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setShowWarehouseModal(true)}
              className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Склад</div>
                  <div className={`text-sm ${selectedWarehouse ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {selectedWarehouse?.name || 'Выберите склад'}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setShowPriceTypeModal(true)}
              className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Тип цены</div>
                  <div className={`text-sm ${selectedPriceType ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {selectedPriceType?.name || 'Выберите тип цены'}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <button
            onClick={() => setShowProductsModal(true)}
            className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors mb-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Товары</div>
                <div className={`text-sm ${cart.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {cart.length > 0 ? `Выбрано: ${cart.length}` : 'Выберите товары'}
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {cart.length > 0 && (
            <div className="space-y-2 border-t border-gray-100 pt-3">
              {cart.map((product) => (
                <div key={product.id} className="flex justify-between items-center text-sm py-1">
                  <div className="flex-1">
                    <div className="text-gray-700">{product.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateCartItem(product.id, Math.max(1, product.qty - 1))}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        −
                      </button>
                      <span className="text-gray-600">{product.qty}</span>
                      <button
                        onClick={() => updateCartItem(product.id, product.qty + 1)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="ml-2 text-red-500 hover:text-red-600 text-xs"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900 ml-2">
                    {(product.price * product.qty).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-3 mt-3">
                <span className="text-gray-900">Итого:</span>
                <span className="text-gray-900">{totalAmount.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          )}
        </div>

        {submitResult && (
          <div
            className={`rounded-xl p-4 ${
              submitResult.success
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {submitResult.message}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex gap-3">
            <button
              onClick={() => handleCreateSale('draft')}
              disabled={submitting}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors text-xs disabled:opacity-50"
            >
              {submitting ? 'Создание...' : 'Создать продажу'}
            </button>
            <button
              onClick={() => handleCreateSale('done')}
              disabled={submitting}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors text-xs disabled:opacity-50"
            >
              {submitting ? 'Создание...' : 'Создать и провести'}
            </button>
          </div>
        </div>
      </div>

      <SelectModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title="Выберите счёт"
        options={accounts.map((a) => ({ id: String(a.id), name: a.name }))}
        onSelect={(option) => {
          const account = accounts.find((a) => String(a.id) === option.id);
          if (account) {
            setSelectedAccount({ id: account.id, name: account.name });
          }
        }}
        selectedId={selectedAccount ? String(selectedAccount.id) : undefined}
      />

      <SelectModal
        isOpen={showOrganizationModal}
        onClose={() => setShowOrganizationModal(false)}
        title="Выберите организацию"
        options={organizations.map((o) => ({ id: String(o.id), name: o.name }))}
        onSelect={(option) => {
          const org = organizations.find((o) => String(o.id) === option.id);
          if (org) {
            setSelectedOrganization({ id: org.id, name: org.name });
          }
        }}
        selectedId={selectedOrganization ? String(selectedOrganization.id) : undefined}
      />

      <SelectModal
        isOpen={showWarehouseModal}
        onClose={() => setShowWarehouseModal(false)}
        title="Выберите склад"
        options={warehouses.map((w) => ({ id: String(w.id), name: w.name }))}
        onSelect={(option) => {
          const warehouse = warehouses.find((w) => String(w.id) === option.id);
          if (warehouse) {
            setSelectedWarehouse({ id: warehouse.id, name: warehouse.name });
          }
        }}
        selectedId={selectedWarehouse ? String(selectedWarehouse.id) : undefined}
      />

      <SelectModal
        isOpen={showPriceTypeModal}
        onClose={() => setShowPriceTypeModal(false)}
        title="Выберите тип цены"
        options={priceTypes.map((pt) => ({ id: String(pt.id), name: pt.name }))}
        onSelect={(option) => {
          const priceType = priceTypes.find((pt) => String(pt.id) === option.id);
          if (priceType) {
            setSelectedPriceType({ id: priceType.id, name: priceType.name });
          }
        }}
        selectedId={selectedPriceType ? String(selectedPriceType.id) : undefined}
      />

      {showProductsModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Выберите товары</h2>
              <button
                onClick={() => setShowProductsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <div className="mb-4">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    handleProductSearch(e.target.value);
                  }}
                  placeholder="Введите название товара..."
                  className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {loadingProducts ? (
                <div className="text-center text-gray-500 py-8">Поиск...</div>
              ) : products.length === 0 && productSearch ? (
                <div className="text-center text-gray-500 py-8">Товары не найдены</div>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => {
                    const inCart = cart.some((p) => p.id === product.id);
                    const qty = productQuantities[product.id] || 1;

                    return (
                      <div
                        key={product.id}
                        className={`border rounded-lg p-3 ${
                          inCart ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">{product.name}</div>
                            <div className="text-sm font-medium text-gray-700">
                              {product.price.toLocaleString('ru-RU')} ₽
                            </div>
                          </div>
                          {inCart ? (
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-red-500 hover:text-red-600 text-sm font-medium ml-3 whitespace-nowrap"
                            >
                              Удалить
                            </button>
                          ) : (
                            <div className="ml-3 flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                value={qty}
                                onChange={(e) => {
                                  const newQty = parseInt(e.target.value) || 1;
                                  setProductQuantities({ ...productQuantities, [product.id]: newQty });
                                }}
                                className="bg-white text-gray-900 border border-gray-300 rounded-lg px-2 py-1 w-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                onClick={() => handleAddProduct(product)}
                                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 text-sm font-medium whitespace-nowrap"
                              >
                                Добавить
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
