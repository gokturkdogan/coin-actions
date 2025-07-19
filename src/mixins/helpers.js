export default {
    methods: {
        symbolFormatter(symbol) {
            if (typeof symbol !== 'string') return symbol;
            return symbol.replace(/USDT$/, '');
        },
        formatDecimal(value) {
            if (value === null || value === undefined || isNaN(value)) return '0';
            const num = parseFloat(value);
            const isNegative = num < 0;
            const absValue = Math.abs(num);
            const numStr = absValue.toString();
            if (absValue >= 1) {
                const formatted = absValue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                });
                return isNegative ? `-${formatted}` : formatted;
            }
            const match = numStr.match(/^0\.(0*)(\d{1,4})/);
            if (match) {
                const zeros = match[1];
                const digits = match[2];
                return `0.${zeros}${digits}`;
            }
            const fallback = absValue.toFixed(4);
            return isNegative ? `-${fallback}` : fallback;
        },
        percentFormatter(value) {
            if (typeof value !== 'number') return '';
            return value.toFixed(2);
        },
        formatTime(timestamp) {
            if (!timestamp) return '';
            const date = new Date(timestamp);
            return date.toLocaleTimeString('tr-TR', {
                timeZone: 'Europe/Istanbul',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        }
    }
}