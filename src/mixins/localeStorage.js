export default {
    methods: {
        clearPreviousKlinesFromLocalStorage() {
            for (let i = 0; i < localStorage.length; i++) {
                console.log('silindi')
                const key = localStorage.key(i);
                if (key && key.includes('previousKline')) {
                    localStorage.removeItem(key);
                    // localStorage uzunluğu değiştiği için döngüyü baştan başlat
                    i = -1;
                }
            }
        }
    }
}