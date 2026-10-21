const axios = require('axios');

module.exports = async (req, res) => {
    // Разрешаем CORS-запросы на всякий случай
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // Извлекаем параметры из входящего GET/POST запроса от WeMos D1
    const { token, method, ...tgParams } = req.query;

    if (!token || !method) {
        return res.status(400).json({ ok: false, description: "Missing token or method parameter" });
    }

    try {
        // Формируем URL к настоящему серверу Telegram
        const tgUrl = `https://telegram.org{token}/${method}`;
        
        // Отправляем запрос в Telegram из дата-центра Vercel
        const response = await axios({
            method: req.method,
            url: tgUrl,
            data: req.body,
            params: tgParams,
            validateStatus: () => true // Не падать при ошибках самого Telegram
        });

        // Возвращаем ответ обратно на плату
        return res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({ ok: false, description: "Proxy error", error: error.message });
    }
};

