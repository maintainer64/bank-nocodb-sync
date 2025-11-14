import {Collapsible} from "@/components/ui/collapsible";
import {FaSolidRotate} from "solid-icons/fa";
import {AsyncButton} from "@/components/ui/button";

declare const __APP_VERSION__: string;

export const VersionApp = () => {
    return (
        <Collapsible title={`Версия приложения ${__APP_VERSION__}`} defaultOpen={false}>
            <div class="space-y-4">
                <div>
                    <AsyncButton
                        icon={<FaSolidRotate/>}
                        label={`Проверить последнюю версию`}
                        loadingLabel="Проверка..."
                        onClick={async () => {
                        }}
                    />
                </div>
            </div>
        </Collapsible>
    );
};