import {ProviderAny, ProviderParams} from "@/shared/providers/base";
import {Component, Show} from "solid-js";
import {FaSolidDownload, FaSolidRotate} from "solid-icons/fa";
import {convertJsonToCSVString, downloadFile} from "@/shared/utils";
import {useActiveTabUrl} from "@/shared/hooks/useActiveTabUrl";
import {useNocoDbClient} from "@/shared/hooks/useNocoDbClient";
import {AsyncButton} from "@/components/ui/button";
import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";

interface ServiceDetailsPageProps {
    provider: ProviderAny;
}

export const ServiceDetailsPage: Component<ServiceDetailsPageProps> = (props) => {
    const p = props.provider;
    const tab = useActiveTabUrl();
    const nocoDbClient = useNocoDbClient();
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

            <Show when={p.getTransactions}>
                <AsyncButton
                    icon={<FaSolidRotate/>}
                    label="Операции в NocoDB"
                    loadingLabel="Синхронизация..."
                    onClick={async () => {
                        const client = nocoDbClient();
                        const params: ProviderParams = {
                            url: tab.url() ?? "",
                            maxTransactions: maxTransactions(),
                        };
                        const transactions = await p.getTransactions?.(params) || [];
                        console.log("transactions", transactions)
                        const uniformIds = new Set(
                            await client.getTransactionExistsByUniformIds(
                                transactions.map((item) => item.uniform_id)
                            )
                        );
                        const newTransactions = transactions.filter((item) =>
                            !uniformIds.has(item?.uniform_id)
                        );
                        await client.createTransactions(newTransactions);
                    }}
                    successMessage="Операции успешно синхронизированы с NocoDB"
                    errorMessage="Ошибка при синхронизации с NocoDB"
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

            <Show when={p.getAccounts}>
                <AsyncButton
                    icon={<FaSolidRotate/>}
                    label="Счета в NocoDB"
                    loadingLabel="Синхронизация..."
                    onClick={async () => {
                        const client = nocoDbClient();
                        const accounts = await p.getAccounts?.() || [];
                        console.log("accounts", accounts)
                        const externalIds = new Set(
                            await client.getAccountExistsByExternalIds(
                                accounts.map((item) => item.uniform_id)
                            )
                        );
                        console.log("externalIds", externalIds)
                        const newTransactions = accounts.filter((item) =>
                            !externalIds.has(item?.uniform_id)
                        );
                        await client.createAccounts(newTransactions);
                    }}
                    successMessage="Счета успешно синхронизированы с NocoDB"
                    errorMessage="Ошибка при синхронизации с NocoDB"
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

            <Show when={p.getProducts}>
                <AsyncButton
                    icon={<FaSolidRotate/>}
                    label="Операции в NocoDB"
                    loadingLabel="Синхронизация..."
                    onClick={async () => {
                        const client = nocoDbClient();
                        const params: ProviderParams = {
                            url: tab.url() ?? "",
                            maxTransactions: maxTransactions(),
                        };
                        const products = await p.getProducts?.(params) || [];
                        console.log("products", products)
                        const uniformIds = new Set(
                            await client.getProductExistsByUniformIds(
                                products.map((item) => item.uniform_id)
                            )
                        );
                        const newProducts = products.filter((item) =>
                            !uniformIds.has(item?.uniform_id)
                        );
                        await client.createProducts(newProducts);
                    }}
                    successMessage="Операции успешно синхронизированы с NocoDB"
                    errorMessage="Ошибка при синхронизации с NocoDB"
                />
            </Show>
        </div>
    );
};