const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('app hello page');
});

app.get('/hello', (req, res) => {
  res.send('<h3>Hello page- html</h3>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});