const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/api/scrape', async (req, res) => {
    const { keyword } = req.query;
    const url = `https://www.amazon.com/s?k=${keyword}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let data = [];

        $('div.s-result-item').each((index, element) => {
            const title = $(element).find('span.a-text-normal').text();
            const rating = $(element).find('span.a-icon-alt').text();
            const reviews = $(element).find('span.a-size-base').text();
            const image = $(element).find('img.s-image').attr('src');

            data.push({ title, rating, reviews, image });
        });

        res.json(data);
    } catch (error) {
        res.json({ error: 'Erro ao raspar os dados' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
