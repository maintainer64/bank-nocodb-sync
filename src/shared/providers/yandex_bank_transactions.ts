import {Account, getFullNotice, ProviderAny, ProviderParams, Transaction} from "./base";
import {getCookieByName, getMaxTransactions} from "@/shared/utils";
import {swFetch} from "@/shared/sw-fetch";


const PREFIX_BANK = "yandex_";
const BASE_URL = "https://bank.yandex.ru";

// Получение подключенного списка продуктов
async function getHomeProducts(operationId: string) {
    const payload = {
        operationName: "HomeProductsV2",
        variables: {
            homeProductsInput: {},
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: operationId
            }
        }
    };

    const requestOptions = {
        method: "POST",
        credentials: 'include',
        redirect: "follow",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    } as RequestInit;
    const searchParams = new URLSearchParams({operationId} as any);
    const response = await swFetch(
        `${BASE_URL}/graphql?${searchParams.toString()}`,
        requestOptions,
    );
    return await response.json();
}

let lastBundleOperation: string | undefined = undefined;

// Получение данных об операции
async function getFirstOperationId(targetRegex: RegExp): Promise<string> {
    const getBundle = async () => {
        const requestOptions = {
            method: "GET",
            credentials: 'include',
            redirect: "follow"
        } as RequestInit;
        // Получение HTML страницы /my
        const response = await swFetch(
            `${BASE_URL}/my`,
            requestOptions,
        )
        const htmlMy = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlMy, 'text/html');

        // Находим только link с rel="preload" и as="script"
        const preloadScriptLinks = doc.querySelectorAll(
            'link[rel="preload"][as="script"][href]'
        );
        const scriptHrefList = Array.from(preloadScriptLinks).map(
            link => link.getAttribute('href')
        );
        const scriptHref = scriptHrefList.find((value) => (value ?? '').includes('cdn'));
        if (!scriptHref) return "";
        // Получение бандла js страницы
        const jsBundleResponse = await swFetch(scriptHref, requestOptions);
        const jsBundle = await jsBundleResponse.text();
        const regex = /__webpack_require__\.u\s*=\s*(?:function\s*\(chunkId\)|\(chunkId\)\s*=>)\s*\{[\s\S]*?return\s*["']defaults-["']\s*\+\s*chunkId\s*\+\s*["']\.["']\s*\+\s*(\{[\s\S]*?\})/;
        // indexJsContent — это весь текст вашего главного бандла (main.js / runtime.js)
        const match = jsBundle.match(regex);
        if (!match) {
            console.log("Паттерн не найден. Проверьте структуру префикса 'defaults-'");
            return "";
        }
        console.log("Найденный объект чанков:", match[1]);
        const cleanJsonString = match[1]
            .replace(/,\s*([}\]])/g, '$1') // удаляет запятую перед } или ]
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":'); // гарантирует двойные кавычки у ключей
        let chunksObject = {};
        try {
            chunksObject = JSON.parse(cleanJsonString);
        } catch (e) {
            console.error("Не удалось распарсить JSON чанков. Строка:", cleanJsonString, e);
            return undefined;
        }
        // 2. Базовый URL
        const baseUrl = scriptHref.replace(/\/[^/]*$/, '/');
        // 3. Перебор чанков через безопасный Object.entries
        for (const [chunkId, chunkHash] of Object.entries(chunksObject)) {
            const url = `${baseUrl}defaults-${chunkId}.${chunkHash}.js`;
            try {
                console.log(`Загрузка чанка ${chunkId}: ${url}`);

                const response = await swFetch(url, requestOptions);
                if (!response.ok) {
                    console.warn(`Пропуск чанка ${chunkId}: статус ${response.status}`);
                    continue;
                }

                const jsBundle = await response.text();
                const contentMatch = jsBundle.match(targetRegex);
                if (contentMatch) {
                    console.log(`🎯 Найдено в чанке ${chunkId}!`);
                    return jsBundle;
                }
            } catch (error) {
                console.error(`Ошибка сети при запросе чанка ${chunkId}:`, error);
            }
        }
        return undefined;
    }
    if (!lastBundleOperation) {
        lastBundleOperation = await getBundle();
    }
    const contentMatch = (lastBundleOperation || "").match(targetRegex);
    return contentMatch?.[1] || '';
}

// Получение списка операций
async function getBankOperations(operationId: string, cursor?: any) {
    const payload = {
        "operationName": "GetTransactionFeedView",
        "variables": {
            "size": 100,
            "cursor": cursor
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": operationId
            }
        }
    }
    const requestOptions = {
        method: "POST",
        credentials: 'include',
        redirect: "follow",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    } as RequestInit;
    const searchParams = new URLSearchParams({
        operationId: operationId,
    } as any);
    const response = await swFetch(
        `${BASE_URL}/graphql?${searchParams.toString()}`,
        requestOptions,
    );
    return await response.json();
}

// Получение списка SavingsAccountsList
async function getSavingsAccountsList(operationId: string) {
    const payload = {
        "operationName": "SavingsAccountsList",
        "variables": {},
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": operationId
            }
        }
    }
    const requestOptions = {
        method: "POST",
        credentials: 'include',
        redirect: "follow",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    } as RequestInit;
    const searchParams = new URLSearchParams({
        operationId: operationId,
    } as any);
    const response = await swFetch(
        `${BASE_URL}/graphql?${searchParams.toString()}`,
        requestOptions,
    );
    return await response.json();
}

// Получение хеша операции
async function generateHashAccount(yandexLogin: string, id: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${yandexLogin};${id}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const yandexBankTransactions: ProviderAny = {
    getName: () => {
        return "Яндекс-Банк"
    },
    getIcon: () => {
        return "yandex.png"
    },
    getUrl: () => {
        return BASE_URL
    },
    getTransactions: async (params: ProviderParams): Promise<Transaction[]> => {
        const accounts = await yandexBankTransactions.getAccounts?.() || [];
        const rows: Transaction[] = [];
        const maxLimit = getMaxTransactions(params.maxTransactions);
        const yandexLogin = await getCookieByName('yandex_login');
        if (!yandexLogin) return rows;
        const operationId = await getFirstOperationId(/"GetTransactionFeedView":"([a-f0-9]{64})"/);
        if (!operationId) return rows;
        let operations = [];
        let cursor = undefined;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const page = await getBankOperations(operationId, cursor);
            cursor = page?.data?.getTransactionsFeedView?.cursor;
            operations.push(...(page?.data?.getTransactionsFeedView?.items || []));
            if (operations.length >= maxLimit || page?.data?.getTransactionsFeedView?.isEmptyByFilter || !cursor) {
                break;
            }
        }
        operations = operations.slice(0, maxLimit)
        for (const operation of operations) {
            if (operation?.statusCode !== "CLEAR") continue;
            const plain = operation?.title?.plain;
            const compound = operation?.title?.compound?.firstPart && operation?.title?.compound?.secondPart ? `${operation?.title?.compound?.firstPart}->${operation?.title?.compound?.secondPart}` : '';
            const account = accounts.find((account) => operation?.id?.includes(account.institution_domain?.replace(PREFIX_BANK, '')))
            rows.push({
                external_account_id: account?.institution_domain || `${PREFIX_BANK}${await generateHashAccount(yandexLogin, "CARD")}`,
                date: (new Date(operation?.date)).toISOString(),
                name: compound || plain || operation?.description || "",
                description: operation?.comment || operation?.description || compound || plain || operation?.rightSubTitle,
                notes: getFullNotice(
                    operation?.comment,
                    operation?.description,
                    compound,
                    plain,
                    operation?.rightSubTitle,
                ),
                currency: operation?.accountAmount?.currency?.name || "RUB",
                nature: operation?.direction === "CREDIT" ? "income" : "expense",
                amount: parseFloat(operation?.amount?.money?.amount || "0.00"),
                external_id: operation?.id,
                source: PREFIX_BANK,
            })
        }
        return rows;
    },

    getAccounts: async (): Promise<Account[]> => {
        const rows: Account[] = [];
        const yandexLogin = await getCookieByName('yandex_login');
        if (!yandexLogin) return rows;
        const homeProductsHash = await getFirstOperationId(/"HomeProductsV2":"([a-f0-9]{64})"/);
        const homeData = await getHomeProducts(homeProductsHash);
        const products = homeData?.data?.homeProducts?.products || [];
        // Обрабатываем только продукт CARD
        for (const product of products) {
            if (product.id === "CARD") {
                rows.push({
                    name: `Карта ${yandexLogin}`,
                    currency: product.value?.currency || "RUB",
                    opening_balance_date: new Date().toISOString().split('T')[0],
                    institution_name: yandexBankTransactions.getName(),
                    institution_domain: `${PREFIX_BANK}${await generateHashAccount(yandexLogin, "CARD")}`,
                    subtype: "checking",
                    accountable_type: "Depository",
                    notes: `Баланс: ${product.value?.amount} ${product.value?.currency}`,
                } as Account);
            }
        }
        const savingAccountHash = await getFirstOperationId(/"SavingsAccountsList":"([a-f0-9]{64})"/);
        const savingAccounts = await getSavingsAccountsList(savingAccountHash);
        const items = savingAccounts?.data?.bankUser?.savingsAccounts?.items || [];
        for (const item of items) {
            const isDeposit = item.productCode === "Deposit";
            const name = item.name || (isDeposit ? "Вклад" : "Накопительный счёт");
            const parts: string[] = [];
            if (item.interestRate) parts.push(`Ставка: ${item.interestRate}%`);
            if (item.accumulated?.amount) parts.push(`Начислено: ${item.accumulated.amount} ${item.accumulated.currency}`);
            if (item.expiresAt) parts.push(`До: ${item.expiresAt}`);
            const notes = parts.join(', ');
            rows.push({
                name,
                currency: item.balance?.currency || "RUB",
                opening_balance_date: new Date().toISOString().split('T')[0], // точной даты открытия в ответе нет
                institution_name: yandexBankTransactions.getName(),
                institution_domain: `${PREFIX_BANK}${item.id}`,
                subtype: "savings",
                accountable_type: "Depository",
                expiration_date: item.expiresAt || undefined,
                notes,
            } as Account);
        }
        return rows;
    }
}