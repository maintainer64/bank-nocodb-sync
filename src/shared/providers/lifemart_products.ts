import {Product, ProviderAny, ProviderParams, Transaction} from "./base";
import {getCookieByName, getMaxTransactions} from "@/shared/utils";


const PREFIX = "life_mart_";


async function getOrdersByParams(limit: number, offset: number) {
    const requestOptions: any = {
        method: "GET",
        headers: {
            "Authorization": await getCookieByName('auth'),
        },
        redirect: "follow"
    };
    const response = await fetch(
        `https://api.lifemart.ru/api/orders/list?detailed=true&max_records=${limit}&offset=${offset}`,
        requestOptions as RequestInit,
    );
    return await response.json();
}

async function getOrdersByMaxLimit(maxLimit: number) {
    let rows: any[] = [];
    let page = 0;
    while (true) {
        const data = await getOrdersByParams(20, page * 20)
        const currentRows = data?.orders || [];
        rows = rows.concat(currentRows);
        if (rows.length > maxLimit || currentRows.length === 0) break;
        page++;
    }
    return rows.slice(0, maxLimit)
}

export const lifeMartProducts: ProviderAny = {
    getName: () => {
        return "Жизнь март"
    },
    getIcon: () => {
        return "lifemart.png"
    },
    getUrl: () => {
        return "https://lifemart.ru"
    },
    getProducts: async (params: ProviderParams): Promise<Product[]> => {
        let rows: Product[] = [];
        const maxLimit = getMaxTransactions(params.maxTransactions);
        const orders = await getOrdersByMaxLimit(maxLimit);
        for (const order of orders) {
            if (order?.status?.complete !== true) {
                continue;
            }
            for (const product of order?.products || []) {
                const id = (order?.id || "") + "_" + product?.id || "";
                rows.push({
                    uniform_id: id,
                    product_id: product?.id || "",
                    name: product?.name || "",
                    date: order?.delivery_time || order?.prepare_time || order?.create_time,
                    type: order?.type_id || "",
                    shop_location: order?.delivery_department_address || order?.delivery_department_name,
                    quantity: product?.quantity || 1,
                    shop_id: PREFIX + (order?.delivery_department_id || ""),
                    weight_uom_code: "шт",
                    image: product?.photo || "",
                    price_per_unit: product?.priceOverride || product?.price || 0,
                    price_per_quantity: (product?.priceOverride || product?.price || 0) * (product?.quantity || 1),
                    discounted_price_per_unit: product?.priceOverride || product?.price || 0,
                    discounted_price_per_quantity: (product?.priceOverride || product?.price || 0) * (product?.quantity || 1),
                    import_from: 'LifeMart',
                })
            }
        }
        return rows;
    },
}