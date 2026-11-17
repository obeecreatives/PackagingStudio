const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

// Singleton cached formatter as fallback; primary calculations use zero-overhead UTC+7 arithmetic
let wibDateFormatter: Intl.DateTimeFormat | null = null;
function getCachedWibFormatter(): Intl.DateTimeFormat {
  if (!wibDateFormatter) {
    wibDateFormatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
  return wibDateFormatter;
}

export interface WibDateParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hours: number; // 0-23
  minutes: number; // 0-59
  seconds: number; // 0-59
}

/**
 * Menghitung komponen tanggal & waktu pada zona Indonesia Barat (WIB / GMT+7)
 * menggunakan aritmatika UTC+7 murni (ringan & bebas freeze).
 */
export function getWibDateParts(date: Date = new Date()): WibDateParts {
  const shifted = new Date(date.getTime() + WIB_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
    seconds: shifted.getUTCSeconds(),
  };
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Mengembalikan key tanggal YYYY-MM-DD dalam zona waktu Indonesia (WIB / GMT+7). */
export function getWibDateKey(date: Date = new Date()): string {
  const { year, month, day } = getWibDateParts(date);
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/** Mengembalikan tanggal & jam lokal Indonesia format "17 November 2026 · 17:35 WIB (GMT+7)". */
export function getWibFormattedDateTime(date: Date = new Date()): string {
  const { year, month, day, hours, minutes } = getWibDateParts(date);
  const monthName = INDONESIAN_MONTHS[month - 1] ?? getCachedWibFormatter().format(date);
  return `${day} ${monthName} ${year} · ${pad2(hours)}:${pad2(minutes)} WIB (GMT+7)`;
}

/** Mengembalikan tanggal Indonesia format "17 November 2026". */
export function getWibFormattedDate(date: Date = new Date()): string {
  const { year, month, day } = getWibDateParts(date);
  const monthName = INDONESIAN_MONTHS[month - 1] ?? getCachedWibFormatter().format(date);
  return `${day} ${monthName} ${year}`;
}

/**
 * Menghitung kode batch produksi & masa kedaluwarsa (EXP MM / YYYY) berdasarkan tanggal WIB (GMT+7).
 */
export function getWibBatchAndExpiry(
  shelfLifeMonths = 12,
  date: Date = new Date()
): { batchCode: string; expiryLabel: string; expiryCompact: string } {
  const { year, month, day } = getWibDateParts(date);
  const totalMonths = year * 12 + (month - 1) + shelfLifeMonths;
  const expYear = Math.floor(totalMonths / 12);
  const expMonth = (totalMonths % 12) + 1;

  return {
    batchCode: `AK-${String(year).slice(-2)}${pad2(month)}${pad2(day)}`,
    expiryLabel: `${pad2(expMonth)} / ${expYear}`,
    expiryCompact: `${pad2(expMonth)}/${expYear}`,
  };
}
