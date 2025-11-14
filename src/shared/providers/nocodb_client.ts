import {Account, Product, Transaction} from "@/shared/providers/base";

const AccountTableName = 'accounts';
const TransactionTableName = 'transactions_import';
const ProductsTableName = 'shop_products';

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
    private params: NocoDbClientParams;

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
                limit: ids.length,
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
}