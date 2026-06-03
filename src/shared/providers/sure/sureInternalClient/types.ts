// Общие поля, присутствующие при создании любого счёта
export interface BaseAccountFields {
    accountable_type: string;
    return_to?: string;                  // путь редиректа после создания
    name: string;                        // название счёта
    balance: number | string;            // начальный баланс
    currency: string;                    // код валюты (RUB, USD, …)
    opening_balance_date: string;        // дата в формате YYYY-MM-DD
    subtype?: string;                    // например, "checking", "savings",  "hsa", "401k", "brokerage" и т.д.
    institution_name?: string;           // название финансового учреждения
    institution_domain?: string;         // домен учреждения
    notes?: string;                      // заметки
    accountable_attributes?: CreditCardAccountableAttributes | CryptoAccountableAttributes;
}

// Атрибуты, специфичные для CreditCard
interface CreditCardAccountableAttributes {
    available_credit?: string;           // доступный кредитный лимит (число как строка)
    minimum_payment?: string;            // минимальный платёж
    apr?: string;                        // годовая процентная ставка
    expiration_date?: string;            // дата окончания срока действия (YYYY-MM-DD)
    annual_fee?: string;                 // годовая плата
    currency?: string;                   // валюта карты (если отличается от валюты счёта)
}

// Атрибуты, специфичные для Crypto
interface CryptoAccountableAttributes {
    tax_treatment?: string;              // "taxable", "tax_deferred" и т.п.
}

/** Параметры создания API-ключа */
export interface CreateApiKeyParams {
    authenticity_token?: string;
    name: string;
    scopes: string;  // например, 'read_write'
}
