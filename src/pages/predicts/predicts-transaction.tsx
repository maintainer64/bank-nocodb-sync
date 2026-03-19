import {Component, createResource, createSignal, createMemo, Show, For, createEffect, on} from "solid-js";
import {useNocoDbClient} from "@/shared/hooks/useNocoDbClient";
import {TransactionWithId} from "@/shared/providers/base";
import {smartPredict} from "@/pages/predicts/smartPredictor";
import {TransactionTableName} from "@/shared/providers/nocodb_client";
import {setCurrentWidth} from "@/shared/width";


const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24-часовой формат
});

export const PredictPage: Component = () => {
    const nocoDbClient = useNocoDbClient();
    const [selectors] = createResource(
        nocoDbClient,
        async (client) => {
            const [categories, subCategories, epics] = await Promise.all([
                client.getCategories(),
                client.getSubCategories(),
                client.getEpics()
            ]);
            return {categories, subCategories, epics};
        }
    );

    const [train, {mutate: mutateTrain}] = createResource(
        nocoDbClient,
        (client) => client.getLabeledTransactionForTraining()
    );

    const [transactions, {refetch}] = createResource(
        nocoDbClient,
        async (client) => {
            const transaction = await client.getUnlabeledTransaction();
            const nearList = transaction ? await client.getNearTransactions(transaction) : [];
            return {transaction, nearList};
        }
    );

    const [category, setCategory] = createSignal("");
    const [subCategory, setSubCategory] = createSignal("");
    const [epic, setEpic] = createSignal("");
    const [saving, setSaving] = createSignal(false);

    const tx = () => transactions()?.transaction;

    // Предсказание
    const prediction = createMemo(() => {
        const data = train();
        const current = tx();
        if (!data?.length || !current) return null;
        return smartPredict(current, data)
    });

    createEffect(() => {
        const t = tx();
        setCategory(t?.category || "");
        setSubCategory(t?.subcategory || "");
        setEpic(t?.epic || "");
        setCurrentWidth("600px");
    });

    const applyPrediction = () => {
        const p = prediction();
        setCategory(p?.category || "");
        setSubCategory(p?.subcategory || "");
    };

    const copyFrom = (t: TransactionWithId) => {
        if (t.category) setCategory(t.category);
        if (t.subcategory) setSubCategory(t.subcategory);
        if (t.epic) setEpic(t.epic);
    };

    const save = async () => {
        const client = nocoDbClient();
        const currentTx = tx();
        if (!currentTx) return;
        setSaving(true);
        try {
            const transaction = {
                id: currentTx.id,
                category: category() ? category() : undefined,
                subcategory: subCategory() ? subCategory() : undefined,
                epic: epic() ? epic() : undefined,
            };
            await client.updateModels(
                [transaction],
                TransactionTableName,
            )
            refetch();
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div class="p-4 max-w-6xl mx-auto text-sm">
            <Show when={transactions.loading}>
                <div class="text-center py-8 text-gray-500">Загрузка...</div>
            </Show>

            <Show when={!transactions.loading && !tx()}>
                <div class="text-center py-8 text-green-600">✓ Все транзакции размечены</div>
            </Show>

            <Show when={tx()}>
                <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
                    {/* Левая часть - редактирование */}
                    <div class="space-y-3">
                        {/* Текущая транзакция */}
                        <div class="bg-white border rounded p-3">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-xs text-gray-400">{tx()?.date}</span>
                                <span
                                    class={
                                        `font-semibold ${tx()?.type === 'Доход' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx()?.amount?.toLocaleString()} ₽
                                </span>
                            </div>
                            <div class="font-medium">{tx()?.name}</div>
                            {tx()?.uniform_id && <div class="text-xs text-gray-400 mt-1">ID: {tx()?.uniform_id}</div>}
                        </div>

                        {/* Предсказание */}
                        <Show when={prediction()}>
                            <div
                                class="bg-blue-50 border border-blue-200 rounded p-2 flex items-center justify-between">
                                <span class="text-xs">
                                    🤖 <b>{prediction()!.category}</b>
                                    {prediction()!.subcategory && ` → ${prediction()!.subcategory}`}
                                    <span class="text-gray-400 ml-1">({prediction()!.confidence}%)</span>
                                </span>
                                <button class="text-xs text-blue-600 hover:underline" onClick={applyPrediction}>
                                    применить
                                </button>
                            </div>
                        </Show>

                        {/* Селекты */}
                        <div class="space-y-2">
                            <select
                                class="w-full border rounded p-2 text-sm"
                                value={category()}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                }}
                            >
                                <option value="">Категория...</option>
                                <For each={selectors()?.categories}>
                                    {(c) => <option value={c.name}>{c.name}</option>}
                                </For>
                            </select>

                            <select
                                class="w-full border rounded p-2 text-sm"
                                value={subCategory()}
                                onChange={(e) => setSubCategory(e.target.value)}
                            >
                                <option value="">Подкатегория...</option>
                                <For each={selectors()?.subCategories}>
                                    {(s) => <option value={s.name}>{s.name}</option>}
                                </For>
                            </select>

                            <select
                                class="w-full border rounded p-2 text-sm"
                                value={epic()}
                                onChange={(e) => setEpic(e.target.value)}
                            >
                                <option value="">Эпик...</option>
                                <For each={selectors()?.epics}>
                                    {(e) => <option value={e.name}>{e.name}</option>}
                                </For>
                            </select>
                        </div>

                        {/* Кнопки */}
                        <div class="flex gap-2">
                            <button
                                class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                                onClick={save}
                                disabled={saving() || !category()}
                            >
                                {saving() ? "..." : "Сохранить"}
                            </button>
                            <button
                                class="px-4 py-2 border rounded hover:bg-gray-50"
                                onClick={() => refetch()}
                            >
                                Сбросить
                            </button>
                        </div>
                    </div>

                    {/* Правая часть - контекст */}
                    <div class="bg-white border rounded overflow-hidden">
                        <div class="overflow-x-auto"> {/* Добавляем горизонтальную прокрутку */}
                            <table class="w-full text-xs">
                                <thead class="bg-gray-50 text-gray-500">
                                <tr>
                                    <th class="text-left p-2 font-medium sticky left-0 bg-gray-50 z-10">Сумма</th>
                                    <th class="text-left p-2 font-medium">Описание</th>
                                    <th class="text-right p-2 font-medium">Дата</th>
                                    <th class="text-left p-2 font-medium">Категория</th>
                                </tr>
                                </thead>
                                <tbody>
                                <For each={transactions()?.nearList}>
                                    {(t) => {
                                        const isCurrent = t.id === tx()?.id;
                                        return (
                                            <tr
                                                class={`border-t ${isCurrent ? 'bg-yellow-50 font-medium' : 'hover:bg-gray-50'}`}
                                                classList={{"cursor-pointer": !isCurrent && !!t.category}}
                                                onClick={() => !isCurrent && t.category && copyFrom(t)}
                                            >
                                                <td class="p-2 whitespace-nowrap text-gray-500 sticky left-0 bg-white z-10">{t.type === 'Доход' ? '+' : '-'}{
                                                    t.amount?.toLocaleString()
                                                }</td>
                                                <td class="p-2"
                                                    title={t.description}>
                                                    {isCurrent && <span class="text-yellow-600 mr-1">▶</span>}
                                                    {t.name}<br/>{t.description}
                                                </td>
                                                <td class="p-2 text-right whitespace-nowrap">
                                                    {dateTimeFormat.format(new Date(t.date)).replace(
                                                        ',',
                                                        ''
                                                    )}
                                                </td>
                                                <td class="p-2 text-gray-500">
                                                    {t.category || <span class="text-gray-300">—</span>}
                                                </td>
                                            </tr>
                                        );
                                    }}
                                </For>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};
