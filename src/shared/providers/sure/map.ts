import {Account} from "@/shared/providers/base";
import {BaseAccountFields} from "@/shared/providers/sure/sureInternalClient/types";

export function mapAccountToParams(account: Account) {
    // 1. Собираем общие обязательные и опциональные поля
    const baseFields: BaseAccountFields = {
        accountable_type: account.accountable_type || '',
        return_to: '/accounts',
        name: account.name,
        balance: 0, // Укажите дефолтное значение или добавьте balance в интерфейс Account
        currency: account.currency,
        opening_balance_date: account.opening_balance_date,
        subtype: account.subtype as string,
        institution_name: account.institution_name,
        institution_domain: account.institution_domain,
        notes: account.notes,
    };

    // 2. Формируем accountable_attributes в зависимости от типа счета
    switch (account.accountable_type) {
        case 'Depository':
            return [{
                ...baseFields,
            }, '/depositories'];

        case 'Investment':
            return [{
                ...baseFields,
            }, '/investments'];

        case 'CreditCard':
            return [{
                ...baseFields,
                accountable_attributes: {
                    available_credit: account.available_credit,
                    minimum_payment: account.minimum_payment,
                    apr: account.apr,
                    expiration_date: account.expiration_date,
                }
            }, '/credit_cards'];

        case 'Crypto':
            return [{
                ...baseFields,
            }, '/cryptos'];

        default:
            throw new Error(`Unsupported account type: ${account.accountable_type}`);
    }
}