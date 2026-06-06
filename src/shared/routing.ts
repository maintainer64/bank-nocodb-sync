import {createSignal} from "solid-js";
import {TRoute} from "@/shared/types";

const parseHashRoute = (): TRoute => {
    const hash = window.location.hash.replace('#/', '');
    const routes: TRoute[] = ["services", "settings", "onboarding"];
    return (routes.includes(hash as TRoute) ? hash : "services") as TRoute;
};

export const [currentRoute, setCurrentRoute] = createSignal<TRoute>(parseHashRoute());

export const navigateTo = (route: TRoute) => {
    window.location.hash = `/${route}`;
    setCurrentRoute(route);
};

window.addEventListener('hashchange', () => {
    setCurrentRoute(parseHashRoute());
});
