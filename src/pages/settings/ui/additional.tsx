import {Collapsible} from "@/components/ui/collapsible";
import {FaSolidPaperclip} from "solid-icons/fa";
import {AsyncButton} from "@/components/ui/button";
import {setCurrentRoute} from "@/shared/routing";

export const Additional = () => {
    return (
        <Collapsible title="Возможности" defaultOpen={false}>
            <div class="space-y-4">
                <div>
                    <AsyncButton
                        icon={<FaSolidPaperclip/>}
                        label="Разметка транзакций"
                        onClick={async () => {
                            setCurrentRoute("predicts")
                        }}
                    />
                </div>
            </div>
        </Collapsible>
    );
};