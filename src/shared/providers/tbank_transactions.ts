import {Account, ProviderAny, ProviderParams, Transaction} from "./base";
import {getCookieByName, getMaxTransactions} from "@/shared/utils";

const PREFIX_BANK = "tbank_";
const BASE_URL = "https://www.tbank.ru/api/common/v1";
const ACCOUNT_TYPES = new Map([
    ['Current', 'Дебетовый'],
    ['SharedCurrent', 'Дебетовый'],
    ['SharedCredit', 'Кредитный'],
    ['Credit', 'Кредитный'],
    ['Saving', 'Накопительный'],
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
    };

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
    const response = await fetch(
        `${BASE_URL}/operations?${searchParams.toString()}`,
        requestOptions as RequestInit
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
    };
    const searchParams = new URLSearchParams({
        appName: 'supreme',
        appVersion: '0.0.1',
        origin: 'web,ib5,platform',
        sessionid: sessionId,
    } as any);
    const response = await fetch(
        `${BASE_URL}/accounts_light_ib?${searchParams.toString()}`,
        requestOptions as RequestInit
    );
    return await response.json();
}

export const tBankTransactions: ProviderAny = {
    getName: () => {
        return "Т-Банк"
    },
    getIcon: () => {
        return "tbank.png"
    },
    getUrl: () => {
        return "https://www.tbank.ru/mybank/operations"
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
        let rows: Transaction[] = [];
        const maxLimit = getMaxTransactions(params.maxTransactions);
        const payload = (resp?.payload || []).slice(0, maxLimit)
        payload?.map((operation: any) => {
            if (operation?.status !== "OK") return;
            const category = operation?.spendingCategory?.name || ""
            const subcategory = operation?.subcategory || "";
            const fullCategory = category && subcategory ? category + "_" + subcategory : category + subcategory;
            rows.push({
                name: operation?.description || operation?.brand?.name || operation?.spendingCategory?.name,
                date: (new Date(operation?.operationTime?.milliseconds)).toISOString(),
                card_number: operation?.cardNumber || operation?.card || operation?.account,
                amount: (operation?.type === "Credit" ? 1 : -1) * (operation?.accountAmount?.value || 0),
                category: fullCategory,
                skip: false,
                accounts: `${PREFIX_BANK}${operation?.account || operation?.payment?.bankAccountId}`,
                uniform_id: operation?.id || operation?.operationId?.value,
            })
        })
        return rows;
    },

    getAccounts: async (): Promise<Account[]> => {
        const resp = await getAccounts();
        const rows: Account[] = [];
        resp?.payload?.map((account: any) => {
            if (!account?.id) return;
            const accountType = ACCOUNT_TYPES.get(account.accountType);
            if (!accountType) return;
            rows.push({
                name: account?.name,
                currency: account?.currency?.name || '',
                type: accountType,
                start: (new Date(account?.creationDate?.milliseconds)).toISOString(),
                uniform_id: `${PREFIX_BANK}${account?.id}`
            })
        });
        return rows;
    }
}