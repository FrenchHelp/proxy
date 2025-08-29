// A very simple proxy server using Express and node-fetch
// For educational purposes only — not production-ready

import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic route: /proxy?url=https://example.com
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('Missing "url" query parameter');
  }

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type');

    // Pass through the content type so the browser knows how to render it
    if (contentType) {
      res.set('Content-Type', contentType);
    }

    // Stream the response directly back to the client
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send(`Error fetching ${targetUrl}: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
