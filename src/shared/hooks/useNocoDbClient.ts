import {NocoDbClient} from "@/shared/providers/nocodb_client";
import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";
import {createMemo} from "solid-js";

export function useNocoDbClient() {
    const [baseUrl] = useUniversalStorage('nocodb-url', '');
    const [token] = useUniversalStorage('nocodb-token', '');
    const [baseId] = useUniversalStorage('nocodb-base-id', '');

    return createMemo(() => {
        const params = {
            baseUrl: baseUrl().replace(/\/+$/, ''),
            token: token(),
            baseId: baseId(),
        }
        return new NocoDbClient(params);
    });
}