import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";
import {createMemo} from "solid-js";
import {SureService} from "@/shared/providers/sure/intex";
import {ProviderFormatCSV, ProviderSync} from "@/shared/providers/base";
import {FireflyService} from "@/shared/providers/firefly/firefly-service";
import {DefaultCsvService} from "@/shared/providers/csv/default-csv";

interface Services {
    csv: ProviderFormatCSV,
    services: ProviderSync[],
}

export function useServices() {
    const [exportType] = useUniversalStorage('export-type', 'csv');
    const [sureUrl] = useUniversalStorage('sure-url', '');
    const [fireFlyUrl] = useUniversalStorage('firefly-url', '');
    const [fireFlyToken] = useUniversalStorage('firefly-token', '');

    // eslint-disable-next-line solid/reactivity
    return createMemo(() => {
        const response = {} as Services;
        const sure = new SureService(sureUrl().replace(/\/+$/, ''));
        const firefly = new FireflyService(fireFlyUrl().replace(/\/+$/, ''), fireFlyToken());
        const defaultService = new DefaultCsvService();
        if (sureUrl() != "") {
            response.services.push(sure)
        }
        if (fireFlyUrl() != "") {
            response.services.push(firefly)
        }
        if (exportType() == "sure") {
            response.csv = sure;
        } else if (exportType() == "firefly") {
            response.csv = firefly;
        } else {
            response.csv = defaultService;
        }
        return response;
    });
}