// api.ts

import {CreateApiKeyParams, BaseAccountFields} from "@/shared/providers/sure/sureInternalClient/types";
import {Api} from "@/shared/providers/sure/sureClient/Api";
import {flattenObject} from "@/shared/providers/sure/sureInternalClient/utils";

/**
 * Параметры конструктора API-клиента.
 */
interface ApiOptions {
    /** Базовая функция fetch (например, для использования в Node.js с node-fetch) */
    fetch?: typeof fetch;
    /** Политика отправки cookies (по умолчанию 'same-origin') */
    credentials?: RequestCredentials;
}

/**
 * Основной класс для взаимодействия с API.
 */
export class SureInternalApi {
    private readonly baseUrl: string;
    private lastCSRF: string = "";
    private readonly fetchFn: typeof fetch;
    private readonly credentials: RequestCredentials;

    constructor(baseUrl: string, options: ApiOptions = {}) {
        // Убираем завершающий слеш, чтобы избежать двойных слешей
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.fetchFn = options.fetch ?? globalThis.fetch.bind(globalThis);
        this.credentials = options.credentials ?? 'include';
    }

    /**
     * Получение свежего authenticity_token со главной страницы.
     * Ищет <meta name="csrf-token" content="..."> и <form action="/{action}/"><input name="authenticity_token">
     */
    private async fetchAuthenticityToken(path: string, action: string): Promise<string> {
        const url = `${this.baseUrl}${path}`;
        const response = await this.fetchFn(url, {
            credentials: this.credentials,
        });
        const html = await response.text();

        // Загружаем HTML в виртуальный DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const metaTag = doc.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        if (metaTag && metaTag.content) {
            this.lastCSRF = metaTag.content;
        }

        const inputInPostForm = doc.querySelector(`form[method="post" i][action*="${action}" i] input[type="hidden"][name="authenticity_token"]`) as HTMLInputElement | null;
        if (inputInPostForm && inputInPostForm.value) {
            return inputInPostForm.value;
        }

        throw new Error('Не удалось найти Authenticity или CSRF токен через DOM');
    }


    /**
     * Универсальный метод для отправки POST-запроса с form-urlencoded телом.
     * После ответа 302 автоматически следует редиректам и возвращает финальный ответ.
     *
     * @param path - путь относительно baseUrl (начинается с /)
     * @param body - объект с ключами и значениями (уже должен содержать authenticity_token,
     *               если он требуется сервером)
     */
    async postForm(path: string, body: Record<string, string>): Promise<Response> {
        const url = `${this.baseUrl}${path}`;
        const formBody = new URLSearchParams(body).toString();

        return this.fetchFn(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Csrf-Token': this.lastCSRF,
                'Origin': this.baseUrl,
            },
            body: formBody,
            credentials: this.credentials,
            // follow — стандартное поведение, после 302 автоматически идём GET’ом на новый URL
            redirect: 'follow',
        });
    }

    /**
     * Создаёт новый депозитарный счёт (POST /depositories).
     */
    async createDepository(
        params: [BaseAccountFields, string],
    ): Promise<Response> {
        const path = params[1];
        const paramsFlatted = flattenObject(params[0], "account")
        const token = await this.fetchAuthenticityToken(`${path}/new?return_to=/account`, path);
        return this.postForm(path, {
            authenticity_token: token,
            ...paramsFlatted
        });
    }

    /**
     * Создаёт новый API-ключ (POST /settings/api_key).
     */
    async createApiKey(
        params: CreateApiKeyParams,
    ): Promise<Response> {
        const path = '/settings/api_key';
        const paramsFlatted = flattenObject(params, "api_key");
        const token = await this.fetchAuthenticityToken(`${path}/new?regenerate=true`, path);
        return this.postForm(path, {
            authenticity_token: token,
            ...paramsFlatted
        });
    }

    async externalApi(): Promise<Api> {
        const response = await this.createApiKey({name: 'bank-sync', scopes: 'read_write'});
        if (!response.ok) {
            throw Error("Not create or reject API key");
        }
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const element = doc.getElementById('api-key-display');
        const apiKey = element?.textContent || "";
        return new Api({
            baseUrl: this.baseUrl, baseApiParams: {
                credentials: 'include',
                headers: {
                    "X-Api-Key": apiKey,
                }
            }
        })
    }
}