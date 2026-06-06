export interface Transaction {
    external_account_id: string; // Account ID (required)
    date: string;  // Transaction date + time
    amount: number; // Transaction amount
    name: string;  // Transaction name/description
    description?: string;  // Alternative to name field
    notes?: string;  // Additional notes
    currency: string;  // Currency code (defaults to family currency)
    nature: "income" | "expense" | "inflow" | "outflow";  // Transaction nature (determines sign)
    external_id: string;  // Optional external idempotency key scoped to account and source
    source: string;  // Optional source namespace for external_id. Requires external_id and defaults to api when external_id is provided
}

export type AccountTypes =
    'Depository'
    | 'Investment'
    | 'Crypto'
    | 'Property'
    | 'Vehicle'
    | 'CreditCard'
    | 'Loan'
    | 'OtherAsset'
    | 'OtherLiability';

export type AccountSubtype =
// Depository
    "checking" |
    "savings" |
    "hsa" |
    "cd" |
    "money_market" |
    ""

export interface AccountTypeWithSubtype {
    subtype: AccountSubtype;
    accountable_type: AccountTypes;
}

export interface Account {
    name: string; // Название счёта
    currency: string; // Валюта
    opening_balance_date: string; // Дата открытия баланса
    institution_name: string; // Название банка
    institution_domain: string; // ID внешний для связки
    subtype: AccountSubtype; // Подтип
    expiration_date?: string; // Дата окончания срока
    available_credit?: string;           // Для кредиток доступный кредитный лимит (число как строка)
    minimum_payment?: string;            // Для кредиток минимальный платёж
    apr?: string;                        // Для кредиток годовая процентная ставка
    accountable_type?: AccountTypes; // Тип счёта
    notes?: string; // Дата создания или другая удобная информация для пользователя
}

export interface Product {
    name: string
    product_id: string
    date: string
    shop_id: string
    shop_location: string
    quantity: number
    weight_uom_code: string
    image: string
    price_per_unit: number
    price_per_quantity: number
    discounted_price_per_unit: number
    discounted_price_per_quantity: number
    type: string
    import_from: 'LavkaYandex' | 'X5' | 'LifeMart'
    uniform_id: string
}


export interface ProviderParams {
    url: string
    maxTransactions: string
}

export interface ProviderAny {
    getName(): string;

    getIcon(): string;

    getUrl(): string;

    getTransactions?(params: ProviderParams): Promise<Transaction[]>;

    getAccounts?(): Promise<Account[]>;

    getProducts?(params: ProviderParams): Promise<Product[]>;
}

export const getFullNotice = (...args: any): string => {
    const filteredArray = args.filter(item => typeof item === 'string' && item.length > 0);
    const uniqueArray = [...new Set(filteredArray)];
    return uniqueArray.join(';');
};

export const getCurrencyCodeMap = (currency?: string): string => {
    if (currency === "RUR") return "RUB"
    return currency || "RUB";
};

export interface ProviderSync {
    getName(): string;

    createAccountsIfNotExists(accounts: Account[]): Promise<void>;

    createTransactionsIfNotExists(transactions: Transaction[]): Promise<void>;
}

export interface ProviderFormatCSV {
    accountsToCSV(accounts: Account[]): Promise<any[]>;

    transactionsToCSV(transactions: Transaction[]): Promise<any[]>;
}