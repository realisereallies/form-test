const API_BASE = 'https://app.tablecrm.com/api/v1';

export async function checkToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/docs_sales/?token=${token}`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function searchClient(phone: string, token: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const response = await fetch(
    `${API_BASE}/clients?phone=${cleanPhone}&token=${token}`
  );
  if (!response.ok) {
    throw new Error('Ошибка поиска клиента');
  }
  const data = await response.json();
  return data;
}

export async function fetchSales(token: string) {
  const response = await fetch(`${API_BASE}/docs_sales?token=${token}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки продаж');
  }
  return response.json();
}

export async function searchProducts(query: string, token: string) {
  const response = await fetch(
    `${API_BASE}/products?search=${encodeURIComponent(query)}&token=${token}`
  );
  if (!response.ok) {
    throw new Error('Ошибка поиска товаров');
  }
  return response.json();
}

export async function createSale(payload: {
  organization: number;
  warehouse: number;
  goods: Array<{ nomenclature: number; quantity: number; price: number }>;
  status: boolean;
  contragent?: number;
  contragent_name?: string;
}, token: string) {
  const requestBody = [payload];
  console.log('Отправляемый payload:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(`${API_BASE}/docs_sales/?token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorMessage = 'Ошибка создания продажи';
    let errorDetails = null;
    try {
      const errorData = await response.json();
      errorDetails = errorData;
      console.error('Ошибка от сервера:', JSON.stringify(errorData, null, 2));
      
      if (errorData.detail) {
        errorMessage = Array.isArray(errorData.detail) 
          ? errorData.detail.map((e: unknown) => {
              if (typeof e === 'object' && e !== null && 'msg' in e) {
                return String(e.msg);
              }
              return String(e);
            }).join(', ')
          : String(errorData.detail);
      } else if (errorData.message) {
        errorMessage = String(errorData.message);
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    } catch {
      errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
    }
    const error = new Error(errorMessage);
    (error as unknown as { details: unknown }).details = errorDetails;
    throw error;
  }

  const result = await response.json();
  console.log('Ответ от сервера:', JSON.stringify(result, null, 2));
  return result;
}

