import {Collapsible} from "@/components/ui/collapsible";
import {useUniversalStorage} from "@/shared/hooks/useUniversalStorage";
import {FaSolidDownload, FaSolidFileImport} from "solid-icons/fa";
import {downloadFile} from "@/shared/utils";
import {AsyncButton} from "@/components/ui/button";

export const ImportExportSettings = () => {
    const [url, setUrl] = useUniversalStorage('sure-url', '');
    const [max, setMax] = useUniversalStorage('general-max-transactions', '1000');
    const importSettings = (event: Event) => {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) {
            throw "Нет выбранного файла";
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target?.result as string);

                // Обновляем все настройки
                if (settings['sure-url'] !== undefined) {
                    setUrl(settings['sure-url']);
                }
                if (settings['general-max-transactions'] !== undefined) {
                    setMax(settings['general-max-transactions']);
                }
            } catch (error) {
                console.error('Import error:', error);
                throw error
            }

            // Сбрасываем input чтобы можно было выбрать тот же файл снова
            input.value = '';
        };
        reader.readAsText(file);
    };
    return (
        <Collapsible title="Импорт | Экспорт настроек" defaultOpen={false}>
            <div class="space-y-4">
                <div>
                    <AsyncButton
                        icon={<FaSolidDownload/>}
                        label="Сохранить настройки в JSON"
                        loadingLabel="Сохранение..."
                        onClick={async () => {
                            const settings = {
                                'sure-url': url(),
                                'general-max-transactions': max()
                            }
                            downloadFile(
                                "settings.json",
                                JSON.stringify(settings, null, 2)
                            );
                        }}
                        successMessage="Настройки успешно сохранены в JSON"
                        errorMessage="Ошибка при сохранение настроек в JSON"
                    />
                </div>
                <div>
                    <AsyncButton
                        icon={<FaSolidFileImport/>}
                        label="Импортирование настроек JSON"
                        loadingLabel="Импортирование..."
                        onClick={async () => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.json';
                            input.onchange = importSettings;
                            input.click();
                        }}
                        successMessage="Настройки успешно сохранены в JSON"
                        errorMessage="Ошибка при сохранение настроек в JSON"
                    />
                </div>
            </div>
        </Collapsible>
    );
};