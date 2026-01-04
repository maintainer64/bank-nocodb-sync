import {TransactionWithId} from "@/shared/providers/base";

interface Prediction {
    category: string;
    subcategory?: string;
    confidence: number;
    reason: string;
}

// Веса для разных методов
const WEIGHTS = {
    exactDescription: 100,
    fuzzyHigh: 40,
    fuzzyMedium: 20,
    mcc: 15,
    amountRange: 5,
};

export function smartPredict(current: TransactionWithId, trainData: TransactionWithId[]): Prediction | null {
    if (!trainData.length) return null;

    const candidates: Map<string, {
        category: string;
        subcategory?: string;
        score: number;
        reasons: string[];
    }> = new Map();

    const desc = normalize(current.description);
    const words = extractWords(desc);

    for (const train of trainData) {
        if (!train.category) continue;

        const key = `${train.category}|${train.subcategory || ""}`;
        const trainDesc = normalize(train.description);
        const trainWords = extractWords(trainDesc);

        let score = 0;
        const reasons: string[] = [];

        // 1. Точное совпадение
        if (desc === trainDesc) {
            score += WEIGHTS.exactDescription;
            reasons.push("exact");
        } else {
            // 2. Fuzzy match
            const overlap = words.filter(w => trainWords.includes(w)).length;
            const ratio = overlap / Math.max(words.length, 1);

            if (ratio >= 0.7) {
                score += WEIGHTS.fuzzyHigh;
                reasons.push("fuzzy-high");
            } else if (ratio >= 0.4) {
                score += WEIGHTS.fuzzyMedium;
                reasons.push("fuzzy-med");
            }
        }

        // 3. MCC
        if (current.uniform_id && current.uniform_id === train.uniform_id) {
            score += WEIGHTS.mcc;
            reasons.push("mcc");
        }

        // 4. Похожая сумма (±20%)
        if (current.amount && train.amount) {
            const ratio = current.amount / train.amount;
            if (ratio > 0.8 && ratio < 1.2) {
                score += WEIGHTS.amountRange;
                reasons.push("amount");
            }
        }

        if (score > 0) {
            const existing = candidates.get(key);
            if (!existing || existing.score < score) {
                candidates.set(key, {
                    category: train.category,
                    subcategory: train.subcategory,
                    score,
                    reasons
                });
            }
        }
    }

    if (candidates.size === 0) return null;

    // Сортируем и берём лучший
    const sorted = [...candidates.values()].sort((a, b) => b.score - a.score);
    const best = sorted[0];

    // Confidence на основе отрыва от второго места
    const gap = sorted[1] ? (best.score - sorted[1].score) / best.score : 1;
    const confidence = Math.min(95, Math.round(30 + best.score * 0.5 + gap * 20));

    return {
        category: best.category,
        subcategory: best.subcategory,
        confidence,
        reason: best.reasons.join(", ")
    };
}

function normalize(text?: string): string {
    return (text || "")
        .toLowerCase()
        .replace(/[^\wа-яё]/gi, " ")
        .replace(/\d+/g, " ") // убираем цифры
        .replace(/\s+/g, " ")
        .trim();
}

function extractWords(text: string): string[] {
    return text.split(/[ ;]+/).filter(w => w.length > 2);
}