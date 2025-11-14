export interface Transaction {
    name: string;
    date: string;
    card_number: string;
    amount: number;
    category: string;
    skip: boolean;
    comment?: string;
    accounts: string;
    uniform_id: string;
}

export interface Account {
    name: string;
    currency: string;
    type: string;
    start: string;
    end?: string;
    uniform_id: string;
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