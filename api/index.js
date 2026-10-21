
const axios = require('axios');

module.exports = async (req, res) => {
    // Включаем CORS-заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // Извлекаем основные параметры и очищаем их от случайных пробелов/переносов строк
    let token = req.query.token ? String(req.query.token).trim() : null;
    let method = req.query.method ? String(req.query.method).trim() : null;

    if (!token || !method) {
        return res.status(400).json({ ok: false, description: "Missing token or method parameter" });
    }

    try {
        // Собираем чистый базовый URL для Telegram
        const tgUrl = "https://telegram.org" + token + "/" + method;
        
        // Клонируем входящие GET-параметры (чтобы не передавать дубли токена и метода)
        const cleanParams = { ...req.query };
        delete cleanParams.token;
        delete cleanParams.method;

        // Выполняем HTTP-запрос
        const response = await axios({
            method: req.method,
            url: tgUrl,
            params: cleanParams, // Передаем chat_id, text и т.д. в качестве параметров запроса
            data: req.body,      // Передаем тело, если это POST-запрос
            validateStatus: () => true // Предотвращаем падение при ошибках самого Telegram
        });

        // Отправляем чистый ответ обратно
        return res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({ ok: false, description: "Proxy error", error: error.message });
    }
};
