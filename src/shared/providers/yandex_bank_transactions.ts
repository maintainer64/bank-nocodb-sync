import {ProviderAny, ProviderParams, Transaction} from "./base";
import {getCookieByName, getMaxTransactions} from "@/shared/utils";


const PREFIX_BANK = "yandex_";
const BASE_URL = "https://bank.yandex.ru";


// Получение данных об операции
async function getFirstOperationId() {
    const requestOptions = {
        method: "GET",
        credentials: 'include',
        redirect: "follow"
    };
    // Получение HTML страницы /my
    const response = await fetch(
        `${BASE_URL}/my`,
        requestOptions as RequestInit,
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
    if (!scriptHref) return;
    const regex = /(\d+):"([a-f0-9]+)"/g;
    // Преобразуем в объект
    const jsHashBundle: Set<string> = new Set();
    // Получение бандла js страницы
    const jsBundleResponse = await fetch(scriptHref, requestOptions as RequestInit);
    const jsBundle = await jsBundleResponse.text();
    // Получаем все подбандлы
    const matches = [...jsBundle.matchAll(regex)];
    matches.forEach(match => {
        if (!match[1]) return;
        if (!match[2]) return;
        jsHashBundle.add(`${match[1]}.${match[2]}`);
    });
    for (const hash of ([...jsHashBundle].reverse())) {
        // Удаляем всё после последнего слеша
        // Example baseUrl: https://cdn-ext.prod.yandex-bank.net/build/pudge-bank-web-app-ssr/v2200.2/
        const baseUrl = scriptHref.replace(/\/[^\/]*$/, '/');
        // Получение бандла js страницы
        const url = `${baseUrl}modern-${hash}.js`;
        const response = await fetch(
            url,
            requestOptions as RequestInit
        );
        const jsBundle = await response.text();
        const regex = /"GetTransactionFeedView":"([a-f0-9]{64})"/;
        const match = jsBundle.match(regex);
        if (!match) continue
        return match[1];
    }
}

// Получение списка операций
async function getBankOperations(operationId: string, cursor?: any) {
    const payload = {
        "operationName": "GetTransactionFeedView",
        "variables": {
            "size": 30,
            "filterType": "PAY_CARD",
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
    };
    const searchParams = new URLSearchParams({
        operationId: operationId,
    } as any);
    const response = await fetch(
        `${BASE_URL}/graphql?${searchParams.toString()}`,
        requestOptions as RequestInit
    );
    return await response.json();
}

// Получение хеша операции
async function generateHashAccount(yandexLogin: string, rightSubTitle: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${yandexLogin};${rightSubTitle}`);
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
        let rows: Transaction[] = [];
        const maxLimit = getMaxTransactions(params.maxTransactions);
        const yandexLogin = await getCookieByName('yandex_login');
        if (!yandexLogin) return rows;
        const operationId = await getFirstOperationId();
        if (!operationId) return rows;
        let operations = [];
        let cursor = undefined;
        while (true) {
            const page = await getBankOperations(operationId, cursor);
            cursor = page?.data?.getTransactionsFeedView?.cursor;
            operations.push(...(page?.data?.getTransactionsFeedView?.items || []));
            if (operations.length >= maxLimit || page?.data?.getTransactionsFeedView?.isEmptyByFilter) {
                break;
            }
        }
        operations = operations.slice(0, maxLimit)
        console.log(operations);
        for (const operation of operations) {
            if (operation?.statusCode !== "CLEAR") continue;
            const plain = operation?.title?.plain;
            const description = operation?.description;
            const compound = operation?.title?.compound?.firstPart && operation?.title?.compound?.secondPart ? `${operation?.title?.compound?.firstPart}->${operation?.title?.compound?.secondPart}` : '';
            const accounts = await generateHashAccount(
                yandexLogin,
                operation?.rightSubTitle || ''
            );
            rows.push({
                name: compound || plain || description || "",
                date: (new Date(operation?.date)).toISOString(),
                card_number: operation?.rightSubTitle,
                amount: (operation?.direction === "CREDIT" ? 1 : -1) * (parseFloat(operation?.amount?.money?.amount || "0.00")),
                category: description || plain || "",
                skip: false,
                comment: operation?.comment || "",
                accounts:
                    `${PREFIX_BANK}${accounts}`,
                uniform_id: operation?.id,
            })
        }
        return rows;
    },
}