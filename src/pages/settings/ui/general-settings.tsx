import {Collapsible} from "@/components/ui/collapsible";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";

export const GeneralSettings = () => {
    const [max, setMax] = useUniversalStorage('general-max-transactions', '1000');

    return (
        <Collapsible title="Общие настройки" defaultOpen={true}>
            <div class="space-y-4">
                <div>
                    <Label for="general-max-transactions">
                        Максимальное количество выгружаемых операций
                    </Label>
                    <Input
                        id="general-max-transactions"
                        type="text"
                        placeholder="Введите базовый адрес до Nocodb"
                        value={max()}
                        onChange={setMax}
                    />
                </div>
            </div>
        </Collapsible>
    );
};