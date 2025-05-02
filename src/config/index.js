require('dotenv').config();

const express = require('express');
const app = express(); 


module.exports = {
    token: process.env.TOKEN
}

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




