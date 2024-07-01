const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.port || 8000;

app.use(cors({
    origin: '*' 
  }));
app.get('/', (req, res) => {
  res.send('Hello World! from this docker');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});