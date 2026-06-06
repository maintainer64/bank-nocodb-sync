import {Component} from "solid-js";
import {Space} from "@/components/ui/card";
import {GeneralSettings} from "@/pages/settings/ui/general-settings";
import {ImportExportSettings} from "@/pages/settings/ui/import-export-settings";
import {VersionApp} from "@/pages/settings/ui/version-app";

export const SettingsPage: Component = () => {
    return (
        <Space>
            <GeneralSettings/>
            <ImportExportSettings/>
            <VersionApp/>
        </Space>
    );
};