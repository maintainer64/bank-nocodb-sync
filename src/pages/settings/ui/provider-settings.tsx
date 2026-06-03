import {Collapsible} from "@/components/ui/collapsible";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";

export const ProviderSettings = () => {
    const [url, setUrl] = useUniversalStorage('sure-url', '');
    return (
        <Collapsible title="Настройки Sure" defaultOpen={false}>
            <div class="space-y-4">
                <div>
                    <Label for="sure-url">
                        Адрес Sure
                    </Label>
                    <Input
                        id="sure-url"
                        type="text"
                        placeholder="Введите базовый адрес до Sure"
                        value={url()}
                        onChange={setUrl}
                    />
                </div>
            </div>
        </Collapsible>
    );
};