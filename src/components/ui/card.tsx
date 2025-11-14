import {Component, JSX} from "solid-js";

interface CardProps {
    children: JSX.Element;
    class?: string;
}

export const Card: Component<CardProps> = (props) => {
    return (
        <div class={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${props.class || ""}`}>
            {props.children}
        </div>
    );
};

export const Space: Component<CardProps> = (props) => {
    return (
        <div class={`bg-white overflow-hidden ${props.class || ""}`}>
            {props.children}
        </div>
    );
};

export const CardContent: Component<CardProps> = (props) => {
    return (
        <div class={`p-6 ${props.class || ""}`}>
            {props.children}
        </div>
    );
};