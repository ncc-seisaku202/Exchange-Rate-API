document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const conversionModeSelect = document.getElementById('conversionMode');
    const convertButton = document.getElementById('convertButton');
    const convertedAmountSpan = document.getElementById('convertedAmount');
    const loadingMessage = document.getElementById('loading');
    const errorMessage = document.getElementById('error');

    // ここにあなたのAPIキーを貼り付けてください
    const API_KEY = ''; 

    convertButton.addEventListener('click', async () => {
        const amount = parseFloat(amountInput.value);
        const mode = conversionModeSelect.value;

        if (isNaN(amount) || amount <= 0) {
            alert('有効な金額を入力してください。');
            return;
        }

        loadingMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        convertedAmountSpan.textContent = '計算中...';

        let fromCurrency, toCurrency;

        switch (mode) {
            case 'JPY_KRW':
                fromCurrency = 'JPY';
                toCurrency = 'KRW';
                break;
            case 'JPY_SGD':
                fromCurrency = 'JPY';
                toCurrency = 'SGD';
                break;
            case 'KRW_JPY':
                fromCurrency = 'KRW';
                toCurrency = 'JPY';
                break;
            case 'SGD_JPY':
                fromCurrency = 'SGD';
                toCurrency = 'JPY';
                break;
            default:
                console.error('無効な換算モードです。');
                loadingMessage.classList.add('hidden');
                return;
        }

        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
            const data = await response.json();

            if (data.result === 'success' && data.conversion_rates && data.conversion_rates[toCurrency]) {
                const rate = data.conversion_rates[toCurrency];
                const convertedAmount = (amount * rate).toFixed(2); // 小数点以下2桁に丸める
                convertedAmountSpan.textContent = `${convertedAmount} ${toCurrency}`;
            } else {
                errorMessage.classList.remove('hidden');
                convertedAmountSpan.textContent = '0';
                console.error('レート情報の取得に失敗しました。', data);
            }
        } catch (error) {
            errorMessage.classList.remove('hidden');
            convertedAmountSpan.textContent = '0';
            console.error('API呼び出し中にエラーが発生しました。', error);
        } finally {
            loadingMessage.classList.add('hidden');
        }
    });
});