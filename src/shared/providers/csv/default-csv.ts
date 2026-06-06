import {Account, ProviderFormatCSV, Transaction} from "@/shared/providers/base";

export class DefaultCsvService implements ProviderFormatCSV {
    async accountsToCSV(accounts: Account[]): Promise<any[]> {
        return accounts.map(a => ({
            'ID счёта': a.institution_domain,
            'Название': a.name,
            'Валюта': a.currency,
            'Дата открытия': a.opening_balance_date,
            'Банк': a.institution_name,
            'Тип': a.accountable_type || '',
            'Подтип': a.subtype,
            'Заметки': a.notes || '',
            'Название банка': a.institution_name,
        }));
    }

    async transactionsToCSV(transactions: Transaction[]): Promise<any[]> {
        return transactions.map(t => ({
            'ID операции': t.external_id,
            'Дата': t.date,
            'Сумма': t.amount,
            'Название': t.name,
            'Описание': t.description || '',
            'Заметки': t.notes || '',
            'Валюта': t.currency,
            'Тип': t.nature === 'expense' ? 'Расход' : t.nature === 'income' ? 'Доход' : t.nature,
            'Источник': t.source,
        }));
    }
}
