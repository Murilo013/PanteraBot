require('dotenv').config()


module.exports = {
    token: process.env.TOKEN
}

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




