export interface DayInfo {
    isWeekend: boolean;
    isHoliday: boolean;
    isDayOff: boolean;
    isShortDay: boolean;
    holidayName?: string;
    dayOfWeek: string;
}

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const HOLIDAYS_CACHE: Map<string, DayInfo> = new Map();
const MONTH_CACHE: Map<string, string> = new Map();

export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
}

export function getDayOfWeek(dateStr: string): string {
    const date = new Date(dateStr);
    return WEEKDAYS[date.getDay()];
}

function parseDate(dateStr: string): { year: number; month: number; day: number } {
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    return { year, month, day };
}

async function fetchMonthData(year: number, month: number): Promise<string> {
    const cacheKey = `${year}-${String(month).padStart(2, '0')}`;
    if (MONTH_CACHE.has(cacheKey)) {
        return MONTH_CACHE.get(cacheKey)!;
    }

    try {
        const response = await fetch(
            `https://isdayoff.ru/api/getdata?year=${year}&month=${String(month).padStart(2, '0')}`
        );
        if (response.ok) {
            const data = await response.text();
            MONTH_CACHE.set(cacheKey, data);
            return data;
        }
    } catch {
        // ignore errors
    }
    return '';
}

export async function getDayInfo(dateStr: string): Promise<DayInfo> {
    const cached = HOLIDAYS_CACHE.get(dateStr);
    if (cached) return cached;

    const { year, month, day } = parseDate(dateStr);
    const monthData = await fetchMonthData(year, month);
    const date = new Date(dateStr);
    const dayOfWeek = WEEKDAYS[date.getDay()];

    let isDayOff = false;
    let isShortDay = false;
    let isHoliday = false;

    if (monthData && day <= monthData.length) {
        const code = monthData[day - 1];
        if (code === '1') {
            isDayOff = true;
        } else if (code === '2') {
            isShortDay = true;
        } else if (code === '8') {
            isHoliday = true;
            isDayOff = true;
        }
    } else {
        isDayOff = isWeekend(date);
    }

    const dayInfo: DayInfo = {
        isWeekend: isWeekend(date),
        isHoliday,
        isDayOff: isDayOff || isWeekend(date),
        isShortDay,
        dayOfWeek
    };

    HOLIDAYS_CACHE.set(dateStr, dayInfo);
    return dayInfo;
}

export function getDayInfoSync(dateStr: string): DayInfo {
    const cached = HOLIDAYS_CACHE.get(dateStr);
    if (cached) return cached;

    const date = new Date(dateStr);

    return {
        isWeekend: isWeekend(date),
        isHoliday: false,
        isDayOff: isWeekend(date),
        isShortDay: false,
        dayOfWeek: getDayOfWeek(dateStr)
    };
}
