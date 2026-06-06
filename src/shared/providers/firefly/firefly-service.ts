import {Account, ProviderFormatCSV, ProviderSync, Transaction} from "@/shared/providers/base";

export class FireflyService implements ProviderFormatCSV, ProviderSync {
    constructor(
        private readonly baseUrl: string,
        private readonly token: string,
    ) {}

    getName(): string{
        return "Firefly III"
    }

    async accountsToCSV(accounts: Account[]): Promise<any[]> {
        throw new Error("Firefly III format not implemented yet.");
    }

    async transactionsToCSV(transactions: Transaction[]): Promise<any[]> {
        throw new Error("Firefly III format not implemented yet.");
    }

    async createAccountsIfNotExists(_accounts: Account[]): Promise<void> {
        throw new Error("Firefly III sync not implemented yet.");
    }

    async createTransactionsIfNotExists(_transactions: Transaction[]): Promise<void> {
        throw new Error("Firefly III sync not implemented yet.");
    }
}
