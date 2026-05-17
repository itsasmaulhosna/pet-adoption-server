const express = require('express');
const app = express();

const PORT = 2000;

app.get('/', (req, res) => {
  res.send('Server is Running fine!');
});

app.listen(PORT, () => {
  console.log(`Server is running from ${PORT}`);
});
