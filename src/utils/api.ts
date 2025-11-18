const API_BASE = 'https://app.tablecrm.com/api/v1';

export async function checkToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/docs_sales/?token=${token}`);
    return response.ok;
  } catch {
    return false;
  }
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function phoneMatches(searchPhone: string, contragentPhone: string | null | undefined): boolean {
  if (!contragentPhone) return false;
  const normalizedSearch = normalizePhone(searchPhone);
  const normalizedContragent = normalizePhone(contragentPhone);
  
  if (normalizedContragent === normalizedSearch) return true;
<<<<<<< HEAD

  if (normalizedSearch.startsWith('7') && normalizedContragent === normalizedSearch.substring(1)) return true;
  if (normalizedContragent.startsWith('7') && normalizedSearch === normalizedContragent.substring(1)) return true;

=======
  
  if (normalizedSearch.startsWith('7') && normalizedContragent === normalizedSearch.substring(1)) return true;
  if (normalizedContragent.startsWith('7') && normalizedSearch === normalizedContragent.substring(1)) return true;
  
>>>>>>> 1b77ed7 (fix: use real contragent search)
  if (normalizedSearch.length >= 10 && normalizedContragent.length >= 10) {
    if (normalizedSearch.slice(-10) === normalizedContragent.slice(-10)) return true;
  }
  
  return false;
}

export async function searchClient(phone: string, token: string) {
  const cleanPhone = phone.replace(/\D/g, '');
<<<<<<< HEAD
  
  const searchVariants = [
    cleanPhone,
    cleanPhone.startsWith('7') ? cleanPhone.substring(1) : cleanPhone,
    cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone,
  ];
  
  const uniqueVariants = [...new Set(searchVariants)];
  
  for (const searchPhone of uniqueVariants) {
    try {
      const url = `${API_BASE}/meta/contragents?search=${encodeURIComponent(searchPhone)}&token=${token}`;
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }
      const data = await response.json();
      const clientsData = Array.isArray(data) ? data : (data?.result || data?.results || []);
      
      const matchedClients = clientsData.filter((client: { phone?: string | null }) => 
        phoneMatches(phone, client.phone)
      );
      
      if (matchedClients.length > 0) {
        return matchedClients;
      }
    } catch {
      continue;
    }
  }
  
  for (const searchPhone of uniqueVariants) {
    try {
      const url = `${API_BASE}/contragents/?search=${encodeURIComponent(searchPhone)}&token=${token}`;
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }
      const data = await response.json();
      const clientsData = Array.isArray(data) ? data : (data?.result || data?.results || []);
      
      const matchedClients = clientsData.filter((client: { phone?: string | null }) => 
        phoneMatches(phone, client.phone)
      );
      
      if (matchedClients.length > 0) {
        return matchedClients;
      }
    } catch {
      continue;
    }
  }
  
  return [];
=======
  const response = await fetch(
    `${API_BASE}/contragents?search=${encodeURIComponent(cleanPhone)}&token=${token}`
  );
  if (!response.ok) {
    throw new Error('Ошибка поиска клиента');
  }
  const data = await response.json();
  const clientsData = Array.isArray(data) ? data : (data?.result || data?.results || []);
  
  const matchedClients = clientsData.filter((client: { phone?: string | null }) => 
    phoneMatches(phone, client.phone)
  );
  
  return matchedClients.length > 0 ? matchedClients : [];
>>>>>>> 1b77ed7 (fix: use real contragent search)
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
    `${API_BASE}/nomenclature?search=${encodeURIComponent(query)}&token=${token}`
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

  console.log('Тело запроса на сервер:', JSON.stringify(requestBody, null, 2));
  console.log('URL:', `${API_BASE}/docs_sales/?token=${token}`);

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

  return response.json();
}

export async function fetchContragents(token: string) {
  const response = await fetch(`${API_BASE}/contragents/?token=${token}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки клиентов');
  }
  return response.json();
}

export async function fetchWarehouses(token: string) {
  const response = await fetch(`${API_BASE}/warehouses/?token=${token}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки складов');
  }
  return response.json();
}

export async function fetchPayboxes(token: string) {
  const url = `${API_BASE}/payboxes?token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error(`Ошибка загрузки счетов: ${response.status} ${response.statusText}`, { url, errorText });
    throw new Error(`Ошибка загрузки счетов: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchOrganizations(token: string) {
  const response = await fetch(`${API_BASE}/organizations/?token=${token}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки организаций');
  }
  return response.json();
}

export async function fetchPriceTypes(token: string) {
  const url = `${API_BASE}/price_types/?token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error(`Ошибка загрузки типов цен: ${response.status} ${response.statusText}`, { url, errorText });
    throw new Error(`Ошибка загрузки типов цен: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchNomenclature(query: string, token: string) {
  const searchParam = query.trim()
    ? `?search=${encodeURIComponent(query.trim())}&token=${token}`
    : `?token=${token}`;
  const url = `${API_BASE}/nomenclature${searchParam}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error(`Ошибка загрузки номенклатуры: ${response.status} ${response.statusText}`, { url, errorText });
    throw new Error(`Ошибка загрузки номенклатуры: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPayboxes(token: string) {
  const url = `${API_BASE}/payboxes/?token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error(`Ошибка загрузки счетов: ${response.status} ${response.statusText}`, { url, errorText });
    throw new Error(`Ошибка загрузки счетов: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log('Данные счетов от API:', data);
  return data;
}

export async function fetchOrganizations(token: string) {
  const response = await fetch(`${API_BASE}/organizations/?token=${token}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки организаций');
  }
  return response.json();
}

export async function fetchWarehouses(token: string) {
  const response = await fetch(`${API_BASE}/warehouses/?token=${token}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки складов');
  }
  return response.json();
}

export async function fetchPriceTypes(token: string) {
  const response = await fetch(`${API_BASE}/price_types/?token=${token}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки типов цен');
  }
  return response.json();
}

export async function fetchNomenclature(query: string, token: string) {
  const searchParam = query.trim()
    ? `?search=${encodeURIComponent(query.trim())}&token=${token}`
    : `?token=${token}`;
  const response = await fetch(`${API_BASE}/nomenclature${searchParam}`);
  if (!response.ok) {
    throw new Error('Ошибка загрузки номенклатуры');
  }
  return response.json();
}

