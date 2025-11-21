const express = require('express');
const app = express();
const puerto = 3000;
const path = require('path');

app.use('/cart', express.static(path.join(__dirname, 'cart')));
app.use('/cats', express.static(path.join(__dirname, 'cats')));
app.use('/cats_products', express.static(path.join(__dirname, 'cats_products')));
app.use('/products', express.static(path.join(__dirname, 'products')));
app.use('/products_comments', express.static(path.join(__dirname, 'products_comments')));
app.use('/sell', express.static(path.join(__dirname, 'sell')));
app.use('/user_cart', express.static(path.join(__dirname, 'user_cart')));

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});