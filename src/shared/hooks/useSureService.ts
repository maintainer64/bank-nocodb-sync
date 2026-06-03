import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";
import {createMemo} from "solid-js";
import {SureService} from "@/shared/providers/sure/intex";

export function useSureService() {
    const [baseUrl] = useUniversalStorage('sure-url', '');

    return createMemo(() => {
        return new SureService(baseUrl().replace(/\/+$/, ''));
    });
}