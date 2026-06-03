export function flattenObject(
    obj: unknown,
    prefix: string,
    result: Record<string, string> | undefined = undefined
): Record<string, string> {
    result = result || {};
    if (obj === null || typeof obj !== 'object') {
        result[prefix] = String(obj ?? '');
        return result;
    }

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const newKey = `${prefix}[${key}]`;
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            flattenObject(value, newKey, result);
        } else {
            result[newKey] = String(value ?? '');
        }
    }
    return result;
}