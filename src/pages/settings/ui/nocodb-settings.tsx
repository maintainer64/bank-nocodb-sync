import {Collapsible} from "@/components/ui/collapsible";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";

export const NocodbSettings = () => {
    const [url, setUrl] = useUniversalStorage('nocodb-url', '');
    const [token, setToken] = useUniversalStorage('nocodb-token', '');
    const [baseId, setBaseId] = useUniversalStorage('nocodb-base-id', '');
    return (
        <Collapsible title="Настройки NocoDB" defaultOpen={false}>
            <div class="space-y-4">
                <div>
                    <Label for="nocodb-url">
                        Адрес Nocodb
                    </Label>
                    <Input
                        id="nocodb-url"
                        type="text"
                        placeholder="Введите базовый адрес до Nocodb"
                        value={url()}
                        onChange={setUrl}
                    />
                </div>
                <div>
                    <Label for="nocodb-token">
                        Токен Nocodb
                    </Label>
                    <Input
                        id="nocodb-token"
                        type="password"
                        placeholder="Введите ваш токен Nocodb"
                        value={token()}
                        onChange={setToken}
                    />
                </div>
                <div>
                    <Label for="nocodb-base-id">
                        ID базы
                    </Label>
                    <Input
                        id="nocodb-base-id"
                        type="text"
                        placeholder="Введите id базы для операций Nocodb"
                        value={baseId()}
                        onChange={setBaseId}
                    />
                </div>
            </div>
        </Collapsible>
    );
};