export default {
    methods: {
        symbolFormatter(symbol) {
            if (typeof symbol !== 'string') return symbol;
            return symbol.replace(/USDT$/, '');
        },
        formatDecimal(value) {
            if (value === null || value === undefined || isNaN(value)) return '0';

            const num = parseFloat(value);

            return num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
            });
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