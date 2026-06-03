import {Component} from "solid-js";
import {Space} from "@/components/ui/card";
import {ProviderSettings} from "@/pages/settings/ui/provider-settings";
import {GeneralSettings} from "@/pages/settings/ui/general-settings";
import {ImportExportSettings} from "@/pages/settings/ui/import-export-settings";
import {VersionApp} from "@/pages/settings/ui/version-app";
import {Additional} from "@/pages/settings/ui/additional";

export const SettingsPage: Component = () => {
    return (
        <Space>
            <GeneralSettings/>
            <ProviderSettings/>
            <ImportExportSettings/>
            <Additional/>
            <VersionApp/>
        </Space>
    );
};