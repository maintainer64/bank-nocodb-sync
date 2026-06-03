import {ProviderAny, ProviderParams} from "@/shared/providers/base";
import {Component, Show} from "solid-js";
import {FaSolidDownload, FaSolidRotate} from "solid-icons/fa";
import {convertJsonToCSVString, downloadFile} from "@/shared/utils";
import {useActiveTabUrl} from "@/shared/hooks/useActiveTabUrl";
import {AsyncButton} from "@/components/ui/button";
import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";
import {useSureService} from "@/shared/hooks/useSureService";

interface ServiceDetailsPageProps {
    provider: ProviderAny;
}

export const ServiceDetailsPage: Component<ServiceDetailsPageProps> = (props) => {
    const p = props.provider;
    const tab = useActiveTabUrl();
    const api = useSureService();
    const [maxTransactions] = useUniversalStorage('general-max-transactions', '1000');
    return (
        <div class="flex flex-col gap-2 p-4">
            <h3 class="font-semibold text-lg mb-2 flex items-center gap-3 px-2">
                <span class="text-xl">
                    <img
                        width="18"
                        height="18"
                        src={`/services/${p.getIcon()}`}
                        alt={p.getIcon()}
                    />
                </span>
                <span>{p.getName()}</span>
            </h3>

            <Show when={p.getTransactions && p.getAccounts}>
                <AsyncButton
                    icon={<FaSolidRotate/>}
                    label="Синхронизировать в Sure"
                    loadingLabel="Синхронизация..."
                    onClick={async () => {
                        const params: ProviderParams = {
                            url: tab.url() ?? "",
                            maxTransactions: maxTransactions(),
                        };
                        const client = api();
                        const accounts = await p.getAccounts?.() || [];
                        await client.createAccountsIfNotExists(accounts);
                        const transactions = await p.getTransactions?.(params) || [];
                        await client.createTransactionsIfNotExists(transactions);
                    }}
                    successMessage="Счета и операции успешно синхронизированы с Sure"
                    errorMessage="Ошибка при синхронизации с Sure"
                />
            </Show>

            <Show when={p.getTransactions}>
                <AsyncButton
                    icon={<FaSolidDownload/>}
                    label="Операции в CSV"
                    loadingLabel="Экспорт..."
                    onClick={async () => {
                        const params: ProviderParams = {
                            url: tab.url() ?? "",
                            maxTransactions: maxTransactions(),
                        };
                        const transactions = await p.getTransactions?.(params) || [];
                        const csv = convertJsonToCSVString(transactions);
                        downloadFile("data.csv", csv);
                    }}
                    successMessage="Операции успешно экспортированы в CSV"
                    errorMessage="Ошибка при экспорте в CSV"
                />
            </Show>

            <Show when={p.getAccounts}>
                <AsyncButton
                    icon={<FaSolidDownload/>}
                    label="Счета в CSV"
                    loadingLabel="Экспорт..."
                    onClick={async () => {
                        const transactions = await p.getAccounts?.() || [];
                        const csv = convertJsonToCSVString(transactions);
                        downloadFile("data.csv", csv);
                    }}
                    successMessage="Счета успешно экспортированы в CSV"
                    errorMessage="Ошибка при экспорте в CSV"
                />
            </Show>

            <Show when={p.getProducts}>
                <AsyncButton
                    icon={<FaSolidDownload/>}
                    label="Заказы в CSV"
                    loadingLabel="Экспорт..."
                    onClick={async () => {
                        const params: ProviderParams = {
                            url: tab.url() ?? "",
                            maxTransactions: maxTransactions(),
                        };
                        const products = await p.getProducts?.(params) || [];
                        const csv = convertJsonToCSVString(products);
                        downloadFile("data.csv", csv);
                    }}
                    successMessage="Заказы и продукты успешно экспортированы в CSV"
                    errorMessage="Ошибка при экспорте в CSV"
                />
            </Show>
        </div>
    );
};