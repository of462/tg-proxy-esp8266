const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const { token, method, ...tgParams } = req.query;

    if (!token || !method) {
        return res.status(400).json({ ok: false, description: "Missing token or method parameter" });
    }

    try {
        // Создаем валидный объект URL встроенными средствами Node.js
        const urlObj = new URL("https://telegram.org" + token + "/" + method);
        
        // Автоматически переносим все остальные параметры (chat_id, text и т.д.)
        Object.keys(tgParams).forEach(key => {
            urlObj.searchParams.append(key, tgParams[key]);
        });

        // Отправляем запрос
        const response = await axios({
            method: req.method,
            url: urlObj.toString(),
            data: req.body,
            validateStatus: () => true
        });

        return res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({ ok: false, description: "Proxy error", error: error.message });
    }
};
