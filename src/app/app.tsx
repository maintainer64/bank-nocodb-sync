import {Component, Match, Switch} from "solid-js";
import {Navigation} from "../components/navigation";
import {currentRoute} from "../shared/routing";
import {SettingsPage} from "@/pages/settings";
import {Space} from "@/components/ui/card";
import {ServicesPage} from "@/pages/services/services-list-page";
import {Toaster} from "solid-toast";

export const App: Component = () => {
    return (
        <div class="min-h-screen">
            <Navigation/>
            <main class="container mx-auto px-0 py-0">
                <Switch fallback={
                    <Space>
                        <div class="text-center py-8">
                            <div class="text-gray-500 text-lg mb-2">Раздел не найден</div>
                            <div class="text-sm text-gray-400">Текущий путь: {currentRoute()}</div>
                        </div>
                    </Space>
                }>
                    <Match when={currentRoute() === "services"}>
                        <ServicesPage/>
                    </Match>
                    <Match when={currentRoute() === "settings"}>
                        <SettingsPage/>
                    </Match>
                </Switch>
                <Toaster
                    position="top-center"
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        className: '',
                        duration: 5000,
                    }}
                />
            </main>
        </div>
    );
};