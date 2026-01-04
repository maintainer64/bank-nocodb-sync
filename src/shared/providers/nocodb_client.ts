import {Account, Category, Product, Transaction, TransactionWithId} from "@/shared/providers/base";

export const AccountTableName = 'accounts';
export const TransactionTableName = 'transactions';
export const CategoriesTransactionTableName = 'categories';
export const SubCategoriesTransactionTableName = 'subcategories';
export const EpicsTransactionTableName = 'epics';
export const ProductsTableName = 'shop_products';

interface NocoDbClientParams {
    baseUrl: string
    token: string
    baseId: string
}


function chunkArray<T>(array: Array<T>, chunkSize: number): Array<Array<T>> {
    const chunkedArray: Array<Array<T>> = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(
            array.slice(i, i + chunkSize)
        );
    }
    return chunkedArray;
}

export class NocoDbClient {
    public params: NocoDbClientParams;

    constructor(params: NocoDbClientParams) {
        this.params = params
    }

    async getTableIdByName(name: string): Promise<string | undefined> {
        const requestOptions: any = {
            method: "GET",
            headers: {
                "xc-token": this.params.token,
            },
            redirect: "follow"
        };
        const query = new URLSearchParams({
            pageSize: 100,
        } as any).toString()
        const response = await fetch(
            `${this.params.baseUrl}/api/v2/meta/bases/${this.params.baseId}/tables?${query}`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error(`[${response.status}] Ошибка при получении таблицы ${name}`);
        }
        const data = await response.json();
        if (!data?.list) return undefined;
        const table = data?.list?.find((item: any) => item?.table_name === name);
        return table.id;
    }

    async createModels<T>(models: Array<T>, tableName: string): Promise<boolean> {
        const tableId = await this.getTableIdByName(tableName);
        const payloads = chunkArray<T>(models, 100);
        for (const payload of payloads) {
            const requestOptions: any = {
                method: "POST",
                headers: {
                    "xc-token": this.params.token,
                    "Content-Type": "application/json"
                },
                redirect: "follow",
                body: JSON.stringify(payload),
            };
            const response = await fetch(
                `${this.params.baseUrl}/api/v2/tables/${tableId}/records`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error(`[${response.status}] Ошибка при создании ${tableName}`);
            }
        }
        return true;
    }

    async updateModels<T>(models: Array<T>, tableName: string): Promise<boolean> {
        const tableId = await this.getTableIdByName(tableName);
        const payloads = chunkArray<T>(models, 100);
        for (const payload of payloads) {
            const requestOptions: any = {
                method: "PATCH",
                headers: {
                    "xc-token": this.params.token,
                    "Content-Type": "application/json"
                },
                redirect: "follow",
                body: JSON.stringify(payload),
            };
            const response = await fetch(
                `${this.params.baseUrl}/api/v2/tables/${tableId}/records`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error(`[${response.status}] Ошибка при создании ${tableName}`);
            }
        }
        return true;
    }

    async getExistsModels(ids: string[], tableName: string): Promise<string[]> {
        if (ids.length == 0) return [];
        const tableId = await this.getTableIdByName(tableName);
        const idsChunk = chunkArray<string>(ids, 100);
        const uniformIdsExist: string[] = [];
        for (const ids of idsChunk) {
            const requestOptions: any = {
                method: "GET",
                headers: {
                    "xc-token": this.params.token,
                },
                redirect: "follow"
            };
            const query = new URLSearchParams({
                fields: 'uniform_id',
                where: `where=(uniform_id,in,${ids.join(",")})`,
                offset: 0,
                limit: ids.length * 2,
            } as any).toString()
            const response = await fetch(
                `${this.params.baseUrl}/api/v2/tables/${tableId}/records?${query}`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error(`[${response.status}] Ошибка при получении ${tableName}`);
            }
            const data = await response.json();
            const uniformIds = data?.list?.map((item: any) => item?.uniform_id) || [];
            uniformIdsExist.push(...uniformIds);
        }
        return uniformIdsExist
    }

    async getTransactionExistsByUniformIds(ids: string[]): Promise<string[]> {
        return await this.getExistsModels(ids, TransactionTableName);
    }

    async createTransactions(transactions: Transaction[]): Promise<boolean> {
        return await this.createModels<Transaction>(transactions, TransactionTableName)
    }

    async getAccountExistsByExternalIds(ids: string[]): Promise<string[]> {
        return await this.getExistsModels(ids, AccountTableName);
    }

    async createAccounts(accounts: Account[]): Promise<boolean> {
        return await this.createModels<Account>(accounts, AccountTableName)
    }

    async getProductExistsByUniformIds(ids: string[]): Promise<string[]> {
        return await this.getExistsModels(ids, ProductsTableName);
    }

    async createProducts(products: Product[]): Promise<boolean> {
        return await this.createModels<Product>(products, ProductsTableName)
    }

    async getCategories(): Promise<Category[]> {
        const tableId = await this.getTableIdByName(CategoriesTransactionTableName);
        if (!tableId) throw new Error("Таблица категорий не найдена");

        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                "xc-token": this.params.token,
            },
            redirect: "follow"
        };

        const query = new URLSearchParams({}).toString();

        const response = await fetch(
            `${this.params.baseUrl}/api/v2/tables/${tableId}/records?${query}`,
            requestOptions
        );

        if (!response.ok) {
            throw new Error(`[${response.status}] Ошибка при получении списка категорий транзакций`);
        }

        const data = await response.json();
        return data?.list || [];
    }

    async getSubCategories(): Promise<Category[]> {
        const tableId = await this.getTableIdByName(SubCategoriesTransactionTableName);
        if (!tableId) throw new Error("Таблица подкатегорий не найдена");

        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                "xc-token": this.params.token,
            },
            redirect: "follow"
        };

        const query = new URLSearchParams({}).toString();

        const response = await fetch(
            `${this.params.baseUrl}/api/v2/tables/${tableId}/records?${query}`,
            requestOptions
        );

        if (!response.ok) {
            throw new Error(`[${response.status}] Ошибка при получении списка подкатегорий транзакций`);
        }

        const data = await response.json();
        return data?.list || [];
    }

    async getEpics(): Promise<Category[]> {
        const tableId = await this.getTableIdByName(EpicsTransactionTableName);
        if (!tableId) throw new Error("Таблица историй не найдена");

        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                "xc-token": this.params.token,
            },
            redirect: "follow"
        };

        const query = new URLSearchParams({}).toString();

        const response = await fetch(
            `${this.params.baseUrl}/api/v2/tables/${tableId}/records?${query}`,
            requestOptions
        );

        if (!response.ok) {
            throw new Error(`[${response.status}] Ошибка при получении списка историй транзакций`);
        }

        const data = await response.json();
        return data?.list || [];
    }

    async getUnlabeledTransaction(): Promise<TransactionWithId | undefined> {
        const tableId = await this.getTableIdByName(TransactionTableName);
        if (!tableId) throw new Error("Таблица транзакций не найдена");

        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                "xc-token": this.params.token,
            },
            redirect: "follow"
        };

        const query = new URLSearchParams({
            where: "(is_deleted,neq,true)~and(category,blank)",
            sort: "date",
            limit: "1",
        }).toString();

        const response = await fetch(
            `${this.params.baseUrl}/api/v2/tables/${tableId}/records?${query}`,
            requestOptions
        );

        if (!response.ok) {
            throw new Error(`[${response.status}] Ошибка при получении неразмеченной транзакции`);
        }

        const data = await response.json();
        return data?.list?.[0];
    }

    async getLabeledTransactionForTraining(): Promise<TransactionWithId[]> {
        const tableId = await this.getTableIdByName(TransactionTableName);
        if (!tableId) throw new Error("Таблица транзакций не найдена");

        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                "xc-token": this.params.token,
            },
            redirect: "follow"
        };

        const query = new URLSearchParams({
            where: "(is_deleted,neq,true)~and(category,notblank)~and(category,not,Переводы между счетами)",
            sort: "-date",
            limit: "900",
        }).toString();

        const response = await fetch(
            `${this.params.baseUrl}/api/v2/tables/${tableId}/records?${query}`,
            requestOptions
        );

        if (!response.ok) {
            throw new Error(`[${response.status}] Ошибка при получении транзакции для обучения`);
        }

        const data = await response.json();
        return data?.list || [];
    }

    async getNearTransactions(transaction: TransactionWithId, size: number = 5): Promise<TransactionWithId[]> {
        const tableId = await this.getTableIdByName(TransactionTableName);
        if (!tableId) throw new Error("Таблица транзакций не найдена");

        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                "xc-token": this.params.token,
            },
            redirect: "follow"
        };

        const beforeQuery = new URLSearchParams({
            where: `(is_deleted,neq,true)~and(date,lte,exactDate,${transaction.date})~and(id,neq,${transaction.id})`,
            sort: "-date", // Сортируем по убыванию даты (от новых к старым)
            limit: size.toString(),
        }).toString();

        const beforeResponse = await fetch(
            `${this.params.baseUrl}/api/v2/tables/${tableId}/records?${beforeQuery}`,
            requestOptions,
        );

        const afterQuery = new URLSearchParams({
            where: `(is_deleted,neq,true)~and(date,gte,exactDate,${transaction.date})~and(id,neq,${transaction.id})`,
            sort: "date", // Сортируем по возрастанию даты
            limit: size.toString(),
        }).toString();


        const afterResponse = await fetch(
            `${this.params.baseUrl}/api/v2/tables/${tableId}/records?${afterQuery}`,
            requestOptions,
        );

        if (!beforeResponse.ok || !afterResponse.ok) {
            throw new Error("Ошибка при получении контекста транзакций");
        }

        const beforeData = await beforeResponse.json();
        const afterData = await afterResponse.json();

        // 4. Объединяем результаты: до → текущая → после
        const beforeTransactions = beforeData?.list || [];
        const afterTransactions = afterData?.list || [];

        // Реверсируем beforeTransactions, чтобы они шли в хронологическом порядке
        const sortedBefore = [...beforeTransactions].reverse();

        return [
            ...sortedBefore,          // n транзакций до (от старых к новым)
            transaction,       // текущая транзакция
            ...afterTransactions      // n транзакций после (от новых к старым)
        ];
    }
}