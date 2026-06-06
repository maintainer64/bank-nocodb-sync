import {ProviderAny, ProviderParams} from "@/shared/providers/base";
import {Component, For, Show} from "solid-js";
import {FaSolidDownload, FaSolidRotate} from "solid-icons/fa";
import {convertJsonToCSVString, downloadFile} from "@/shared/utils";
import {useActiveTabUrl} from "@/shared/hooks/useActiveTabUrl";
import {AsyncButton} from "@/components/ui/button";
import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";
import {useServices} from "@/shared/hooks/useServices";

interface ServiceDetailsPageProps {
    provider: ProviderAny;
}

export const ServiceDetailsPage: Component<ServiceDetailsPageProps> = (props) => {
    const p = props.provider;
    const tab = useActiveTabUrl();
    const services = useServices();
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
                <For each={services().services}>
                    {(service) => (
                        <AsyncButton
                            icon={<FaSolidRotate/>}
                            label={`Синхронизировать в ${service.getName()}`}
                            loadingLabel="Синхронизация..."
                            onClick={async () => {
                                const params: ProviderParams = {
                                    url: tab.url() ?? "",
                                    maxTransactions: maxTransactions(),
                                };
                                const accounts = await p.getAccounts?.() || [];
                                await service.createAccountsIfNotExists(accounts);
                                const transactions = await p.getTransactions?.(params) || [];
                                await service.createTransactionsIfNotExists(transactions);
                            }}
                            successMessage={`Счета и операции успешно синхронизированы с ${service.getName()}`}
                            errorMessage={`Ошибка при синхронизации с ${service.getName()}`}
                        />
                    )}
                </For>
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
                        const rows = await services().csv.transactionsToCSV(transactions);
                        const csv = convertJsonToCSVString(rows);
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
                        const accounts = await p.getAccounts?.() || [];
                        const rows = await services().csv.accountsToCSV(accounts);
                        const csv = convertJsonToCSVString(rows);
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