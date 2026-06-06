import {SureInternalApi} from "@/shared/providers/sure/sureInternalClient/base";
import {Api as SureExternalApi} from "@/shared/providers/sure/sureClient/Api";
import {AccountCollection, AccountDetail} from "./sureClient/data-contracts";
import {Account, ProviderFormatCSV, ProviderSync, Transaction} from "@/shared/providers/base";
import {mapAccountToParams} from "@/shared/providers/sure/map";

const MAX_PAGES = 1000;

export class SureService implements ProviderSync, ProviderFormatCSV{
    private readonly internalApi: SureInternalApi;
    private externalApi: SureExternalApi | undefined;

    constructor(baseUrl: string) {
        this.internalApi = new SureInternalApi(baseUrl)
        this.externalApi = undefined;
    }


    getName(): string{
        return "Sure"
    }

    async accountsToCSV(accounts: Account[]): Promise<any[]> {
        return accounts.map(a => ({
            name: a.name,
            currency: a.currency,
            opening_balance_date: a.opening_balance_date,
            institution_name: a.institution_name,
            institution_domain: a.institution_domain,
            subtype: a.subtype,
            accountable_type: a.accountable_type || '',
            notes: a.notes || '',
        }));
    }

    async transactionsToCSV(transactions: Transaction[]): Promise<any[]> {
        return transactions.map(t => ({
            date: t.date,
            amount: t.amount,
            name: t.name,
            description: t.description || '',
            notes: t.notes || '',
            currency: t.currency,
            nature: t.nature,
            external_id: t.external_id,
            source: t.source,
            external_account_id: t.external_account_id,
        }));
    }

    private async getInternalApi(): Promise<SureInternalApi> {
        return this.internalApi
    }

    private async getExternalApi(): Promise<SureExternalApi> {
        if (this.externalApi !== undefined) {
            return this.externalApi
        }
        this.externalApi = await this.internalApi.externalApi();
        return this.externalApi
    }

    async createTransactionsIfNotExists(transactions: Transaction[]): Promise<void> {
        const accountsInDb = await this.getFullAccountsInDb();

        const externalApi = await this.getExternalApi();
        for (const transaction of transactions) {
            const accountInDb = this.getAccountsInDbById(
                accountsInDb,
                transaction.external_account_id,
            )
            if (!accountInDb) throw Error(`Невозможно найти счёт ${transaction.external_account_id}`);
            await externalApi.v1TransactionsCreate({
                transaction: {
                    account_id: accountInDb.id,
                    date: transaction.date,
                    amount: transaction.amount,
                    name: transaction.name,
                    description: transaction.description,
                    notes: transaction.notes,
                    currency: transaction.currency,
                    nature: transaction.nature,
                    external_id: transaction.external_id,
                    source: transaction.source,
                },
            })
        }
    }

    private async getFullAccountsInDb(): Promise<AccountDetail[]> {
        const externalApi = await this.getExternalApi();
        const accountsInDb = [];

        for (let page = 1; page <= MAX_PAGES; page++) {
            const response = await externalApi.v1AccountsList({
                include_disabled: true,
                page: page,
                per_page: 100
            });

            // Расширяем интерфейс ответа, добавляя туда поле pagination
            const result: AccountCollection = await response.json();

            // Если данных нет вообще — выходим
            if (!result.accounts || result.accounts.length === 0) {
                break;
            }

            accountsInDb.push(...result.accounts);

            // Условие выхода: если в ответе есть пагинация и текущая страница
            // равна или больше общего количества страниц — прекращаем цикл
            if (result.pagination && page >= result.pagination.total_pages) {
                break;
            }
        }
        return accountsInDb;
    }

    private getAccountsInDbById(db: AccountDetail[], id?: string): AccountDetail | undefined {
        return db.find((account) => {
            // Защита на случай, если domain окажется undefined или null
            if (!account.institution_domain || !id) {
                return false;
            }
            if (account.status === "pending_deletion") {
                return false
            }

            // Проверяем, начинается ли домен из БД с домена из account
            return account.institution_domain.startsWith(id);
        });
    }

    async createAccountsIfNotExists(accounts: Account[]): Promise<void> {
        const accountsInDb = await this.getFullAccountsInDb()
        for (const account of accounts) {
            const accountInDb = this.getAccountsInDbById(
                accountsInDb,
                account.institution_domain
            )
            if (accountInDb) continue;
            if (!account.accountable_type) {
                console.warn("Счёт не имеет типа", account);
            }
            const response = await this.internalApi.createDepository(mapAccountToParams(account))
            if (!response.ok) {
                throw Error(`Не удалось синхронизировать счёт ${account.name} ${account.institution_domain}`)
            }
        }
    }
}