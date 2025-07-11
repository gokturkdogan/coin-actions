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
        }
    }
}