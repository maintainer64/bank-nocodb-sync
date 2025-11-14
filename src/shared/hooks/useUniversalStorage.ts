import {createEffect, createSignal, onMount} from 'solid-js';


export function useUniversalStorage<T>(
    key: string,
    defaultValue: T,
    options?: {
        serialize?: (value: T) => string;
        deserialize?: (value: string) => T;
    }
): [() => T, (value: T | ((prev: T) => T)) => void, () => boolean, () => string, () => boolean] {
    const [value, setValue] = createSignal<T>(defaultValue);
    const [isPersistent, setIsPersistent] = createSignal<boolean>(false);
    const [error, setError] = createSignal<string>('');
    const [isInitialStateResolved, setIsInitialStateResolved] = createSignal<boolean>(false);

    const serialize = options?.serialize || JSON.stringify;
    const deserialize = options?.deserialize || JSON.parse;

    const useLocalStorage = () => {
        onMount(() => {
            try {
                const stored = localStorage.getItem(key);
                if (stored !== null) {
                    const parsed = deserialize(stored);
                    setValue(parsed);
                }
                setIsPersistent(true);
                setIsInitialStateResolved(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                setIsInitialStateResolved(true);
            }
        });

        createEffect(() => {
            if (isInitialStateResolved()) {
                try {
                    const serialized = serialize(value());
                    localStorage.setItem(key, serialized);
                    setError('');
                    setIsPersistent(true);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Unknown error');
                    setIsPersistent(false);
                }
            }
        });
    };

    onMount(() => {
        useLocalStorage();
    });

    const updateValue = (newValue: T | ((prev: T) => T)) => {
        if (typeof newValue === 'function') {
            setValue(prev => (newValue as Function)(prev));
        } else {
            // @ts-ignore
            setValue(newValue);
        }
    };

    return [value, updateValue, isPersistent, error, isInitialStateResolved];
}