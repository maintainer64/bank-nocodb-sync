import {NavItem} from "./nav-item";
import {FaSolidBellConcierge, FaSolidGear} from "solid-icons/fa";

export const Navigation = () => {
    return (
        <nav class="border-gray-200 dark:border-gray-700">
            <ul class="flex flex-row flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <NavItem text="Сервисы" route="services" icon={<FaSolidBellConcierge/>}/>
                <NavItem text="Настройки" route="settings" icon={<FaSolidGear/>}/>
            </ul>
        </nav>
    )
}