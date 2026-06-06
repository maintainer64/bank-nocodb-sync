import {Account, getFullNotice, ProviderAny, ProviderParams, Transaction} from "./base";
import {swFetch} from "@/shared/sw-fetch";
import {getMaxTransactions} from "@/shared/utils";

const SETTINGS = {
    prefix: "sber_",
    name: "Сбер",
    icon: "sber.png",
    url: "https://online.sberbank.ru/app/main",
    baseUrl: "https://web-node4.online.sberbank.ru",
};

// Получение данных о счетах
async function getAccountsMainScreen() {
    const requestOptions = {
        method: "POST",
        credentials: 'include',
        redirect: "follow",
        body: JSON.stringify({
            withData: true,
            forceUpdate: true,
        }),
        headers: {
            'x-requested-with': 'XMLHttpRequest',
            'content-type': 'application/json;charset=UTF-8'
        }
    } as RequestInit;
    const response = await swFetch(
        `${SETTINGS.baseUrl}/main-screen/rest/v2/m1/web/section/meta`,
        requestOptions,
    );
    return await response.json();
}

// Получение данных в списке счетов
async function getTransactions(limit: number = 100, offset: number = 0) {
    const requestOptions = {
        method: "POST",
        credentials: 'include',
        redirect: "follow",
        body: JSON.stringify({
            "paginationOffset": offset,
            "paginationSize": limit,
            "showHidden": false,
            "showNotTransactionBonuses": true,
            "showOpenBanking": true
        }),
        headers: {
            'x-requested-with': 'XMLHttpRequest',
            'content-type': 'application/json;charset=UTF-8'
        }
    } as RequestInit;
    const response = await swFetch(
        `${SETTINGS.baseUrl}/uoh-bh/v1/operations/list`,
        requestOptions,
    );
    return await response.json();
}


export const sberTransactions: ProviderAny = {
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
        const rows: Transaction[] = [];
        const maxLimit = getMaxTransactions(params.maxTransactions);
        let operations = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const page = await getTransactions(100, operations.length);
            const operationsPage = page?.body?.operations || [];
            operations.push(...operationsPage);
            if (operations.length >= maxLimit || operationsPage.length <= 0) {
                break;
            }
        }
        operations = operations.slice(0, maxLimit);
        for (const operation of operations) {
            console.log(operation);
            if (operation?.state?.category?.toLowerCase() !== "executed") continue;
            if (!operation?.externalId){
                console.warn("Operation has not externalId", operation);
            }
            const isoDate = (operation?.date ? new Date(operation.date.replace(/^(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1') + "+03:00") : new Date()).toISOString();
            const base = {
                date: isoDate,
                amount: Math.abs(parseFloat(operation?.operationAmount?.amount || "0.00")),
                name: operation?.description || operation?.correspondent,
                description: operation?.correspondent,
                notes: getFullNotice(
                    operation?.classificationCode,
                    operation?.type,
                    operation?.form,
                    operation?.imageUrl,
                ),
                currency: operation?.operationAmount?.currencyCode || "RUB",
                external_id: operation?.externalId,
                source: SETTINGS.prefix,
                external_account_id: '',
                nature: parseFloat(operation?.operationAmount?.amount || "0.00") > 0 ? 'income' : 'expense',
            } as Transaction
            if (operation?.fromResource?.id) {
                rows.push({
                    ...base,
                    external_account_id: `${SETTINGS.prefix}${operation?.fromResource?.id}`,
                    nature: 'expense',
                })
            }
            if (operation?.toResource?.id) {
                rows.push({
                    ...base,
                    external_id: operation?.fromResource?.id ? `${operation?.externalId}_transfer` : `${operation?.externalId}`,
                    external_account_id: `${SETTINGS.prefix}${operation?.toResource?.id}`,
                    nature: 'income',
                })
            }
        }
        console.log(rows);
        return rows;
    },

    getAccounts: async (): Promise<Account[]> => {
        const rows: Account[] = [];
        const resp = await getAccountsMainScreen();
        const productData = resp?.body?.sections?.technicalSection?.sectionProductData;
        if (!productData) return rows;

        // 1. Транзакционные счета (текущие, не кредитные)
        if (productData.ctaccounts?.data) {
            for (const acct of productData.ctaccounts.data) {
                rows.push({
                    name: acct.name || 'Платёжный счёт',
                    currency: acct.balance?.currency?.code || 'RUB',
                    opening_balance_date: new Date().toISOString().split('T')[0],
                    institution_name: SETTINGS.name,
                    institution_domain: `${SETTINGS.prefix}ct-account:${acct.id}`,
                    subtype: 'checking',
                    accountable_type: 'Depository',
                    notes: acct.number ? `Счёт: ${acct.number}` : undefined,
                } as Account);
            }
        }

        // 2. Вклады и накопительные счета
        if (productData.accounts?.data) {
            for (const dep of productData.accounts.data) {
                const notesParts = [];
                if (dep.rate) notesParts.push(`Ставка: ${dep.rate}%`);
                if (dep.number) notesParts.push(`Счёт: ${dep.number}`);

                rows.push({
                    name: dep.name || 'Вклад',
                    currency: dep.balance?.currency?.code || 'RUB',
                    opening_balance_date: dep.openDate || new Date().toISOString().split('T')[0],
                    institution_name: SETTINGS.name,
                    institution_domain: `${SETTINGS.prefix}account:${dep.id}`,
                    subtype: 'savings', // при наличии closeDate можно менять на 'cd'
                    accountable_type: 'Depository',
                    expiration_date: dep.closeDate || undefined,
                    notes: notesParts.join(';') || undefined,
                } as Account);
            }
        }
        return rows;
    }
}