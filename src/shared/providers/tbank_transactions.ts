import {
    Account,
    AccountTypeWithSubtype,
    getCurrencyCodeMap,
    getFullNotice,
    ProviderAny,
    ProviderParams,
    Transaction
} from "./base";
import {getCookieByName, getMaxTransactions} from "@/shared/utils";
import {swFetch} from "@/shared/sw-fetch";

const SETTINGS = {
    prefix: "tbank_",
    name: "Т-Банк",
    icon: "tbank.png",
    url: "https://www.tbank.ru/mybank/operations",
    baseUrl: "https://www.tbank.ru/api/common/v1",
};


const ACCOUNT_TYPES = new Map<string, AccountTypeWithSubtype>([
    ['Current', {
        accountable_type: 'Depository',
        subtype: 'checking',
    }],
    ['SharedCurrent', {
        accountable_type: 'Depository',
        subtype: 'checking',
    }],
    ['SharedCredit', {
        accountable_type: 'CreditCard',
        subtype: '',
    }],
    ['Credit', {
        accountable_type: 'CreditCard',
        subtype: '',
    }],
    ['Saving', {
        accountable_type: 'Depository',
        subtype: 'savings',
    }],
])

interface Params {
    rangeStart?: string;
    rangeEnd?: string;
    accounts?: string;
}


// Получение данных об операциях
async function getParamsOperation(params: Params) {
    const sessionId = await getCookieByName('psid');
    const requestOptions = {
        method: "GET",
        credentials: 'include',
        redirect: "follow"
    } as RequestInit;

    const now = new Date();

    // Первый день месяца (00:00:00)
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    // Последний день месяца (23:59:59.999)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const searchParams = new URLSearchParams({
        appName: 'supreme',
        appVersion: '0.0.1',
        origin: 'web,ib5,platform',
        sessionid: sessionId,
        end: params.rangeEnd || lastDay.getTime(),
        start: params.rangeStart || firstDay.getTime(),
        accounts: params.accounts || '',
    } as any);
    const response = await swFetch(
        `${SETTINGS.baseUrl}/operations?${searchParams.toString()}`,
        requestOptions,
    );
    return await response.json();
}

// Получение данных об открытых счетах
async function getAccounts() {
    const sessionId = await getCookieByName('psid');
    const requestOptions = {
        method: "GET",
        credentials: 'include',
        redirect: "follow"
    } as RequestInit;
    const searchParams = new URLSearchParams({
        appName: 'supreme',
        appVersion: '0.0.1',
        origin: 'web,ib5,platform',
        sessionid: sessionId,
    } as any);
    const response = await swFetch(
        `${SETTINGS.baseUrl}/accounts_light_ib?${searchParams.toString()}`,
        requestOptions,
    );
    return await response.json();
}

export const tBankTransactions: ProviderAny = {
    getName: () => {
        return SETTINGS.name
    },
    getIcon: () => {
        return SETTINGS.icon
    },
    getUrl: () => {
        return SETTINGS.url
    },

    getTransactions: async (params: ProviderParams): Promise<Transaction[]> => {
        const url = new URL(params.url);
        const operationSettings: Params = {
            rangeStart: url.searchParams.get('rangeStart') ?? '',
            rangeEnd: url.searchParams.get('rangeEnd') ?? '',
            accounts: url.searchParams.getAll('account').join(',')
        };
        console.log('Происходит выгрузка CSV файла с параметрами', operationSettings);
        const resp = await getParamsOperation(operationSettings);
        const rows: Transaction[] = [];
        const maxLimit = getMaxTransactions(params.maxTransactions);
        const payload = (resp?.payload || []).slice(0, maxLimit)
        payload?.map((operation: any) => {
            if (operation?.status !== "OK") return;
            rows.push({
                external_account_id: `${SETTINGS.prefix}${operation?.account || operation?.payment?.bankAccountId}`,
                date: (new Date(operation?.operationTime?.milliseconds)).toISOString(),
                name: operation?.description || operation?.brand?.name || operation?.spendingCategory?.name,
                description: operation?.payment?.fieldsValues?.message || operation?.spendingCategory?.name || operation?.subcategory || operation?.cardNumber || operation?.card,
                notes: getFullNotice(
                    operation?.description,
                    operation?.brand?.name,
                    operation?.spendingCategory?.name,
                    operation?.payment?.fieldsValues?.message,
                    operation?.spendingCategory?.name,
                    operation?.subcategory,
                    operation?.cardNumber,
                    operation?.card
                ),
                currency: getCurrencyCodeMap(operation?.accountAmount?.currency?.name),
                nature: operation?.type === "Credit" ? "income" : "expense",
                amount: operation?.accountAmount?.value || 0,
                external_id: operation?.id || operation?.operationId?.value,
                source: SETTINGS.prefix,
            })
        })
        return rows;
    },

    getAccounts: async (): Promise<Account[]> => {
        const resp = await getAccounts();
        const rows: Account[] = [];
        resp?.payload?.map((account: any) => {
            if (!account?.id) return;
            const accountSure = ACCOUNT_TYPES.get(account.accountType);
            if (!accountSure) return;
            rows.push({
                name: account?.name,
                currency: account?.currency?.name || '',
                opening_balance_date: (new Date(account?.creationDate?.milliseconds)).toISOString().split('T')[0],
                institution_name: SETTINGS.name,
                institution_domain: `${SETTINGS.prefix}${account?.id}`,
                subtype: accountSure.subtype,
                expiration_date: account?.dueDate?.milliseconds ? (new Date(account?.dueDate?.milliseconds)).toISOString().split('T')[0] : undefined,
                available_credit: account?.creditLimit?.value,
                minimum_payment: account?.currentMinimalPayment?.value,
                apr: account?.currentMinimalPayment?.value,
                accountable_type: accountSure.accountable_type,
                notes: "",
            })
        });
        return rows;
    }
}