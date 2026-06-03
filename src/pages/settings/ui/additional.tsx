import {Collapsible} from "@/components/ui/collapsible";
import {FaSolidPaperclip, FaSolidArrowUpRightFromSquare} from "solid-icons/fa";
import {AsyncButton} from "@/components/ui/button";
import {navigateTo} from "@/shared/routing";

export const Additional = () => {
    return (
        <Collapsible title="Возможности" defaultOpen={false}>
            <div class="space-y-4">
                <div>
                    <AsyncButton
                        icon={<FaSolidPaperclip/>}
                        label="Разметка транзакций"
                        onClick={async () => {
                            navigateTo("predicts")
                        }}
                    />
                </div>
                <div>
                    <AsyncButton
                        icon={<FaSolidArrowUpRightFromSquare/>}
                        label="Открыть в отдельной вкладке"
                        onClick={async () => {
                            window.open(window.location.href, '_blank');
                        }}
                    />
                </div>
            </div>
        </Collapsible>
    );
};