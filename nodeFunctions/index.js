const express = require('express');
const cors = require('cors')({ origin: true });
const app = express();
const firebase = require('firebase/app');
const { prices, accounts, products, markets, countries, districts } = require('./firebase-config');

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Get markets
// Get districts/regions
// Get countries
// Get products
// Get product categories** Does not exist
// Get latestPrice (from market/product, product, or market) - maxDate in sql

// Get historicalPrice (from market/product, specify date) // find price, market , date
// Get timeFramePrice (from market/product) ??  every date with a price
// Get coverage (product, markets, districts) ??  product prices


// get prices ? market / product / country / district / on date / less than day / greater than day / 

app.use(express.json());
app.use(cors);

app.listen(4000, () => console.log('Its alive'));

app.post('/add_account', async (req, res) => {
  const data = req.body;
  accounts
    .add(data)
    .then(() => {
      res.status(200).send('doc added');
    })
    .catch((e) => res.status(400).send(e));
});

app.get('/markets', async (req, res) => {
  try {
    const snapshot = await markets.get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(list);
  } catch (e) {
    res.status(400).res.send(e);
  }
});

app.get('/countries', async (req, res) => {
  try {
    const snapshot = await countries.get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(list);
  } catch (e) {
    res.status(400).res.send(e);
  }
});

app.get('/districts', async (req, res) => {
  try {
    const snapshot = await districts.get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(list);
  } catch (e) {
    res.status(400).res.send(e);
  }
});

app.post('add_market', async (req, res) => {
  const data = req.body;
  markets
    .add(data)
    .then(() => {
      res.status(200).send('doc added');
    })
    .catch((e) => res.status(400).send(e));
});

app.get('/prices', async (req, res) => {
  try {
    const snapshot = await prices.get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(list);
  } catch (e) {
    res.status(400).res.send(e);
  }
});

app.get('/pricesById', async (req, res) => {
  const user_id = req.query.user_id;
  try { 
    const snapshot = await prices.where('userId', '==', user_id).get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(list);
  } catch (e) {
    res.status(400).res.send(e);
  }
});

app.post('/add_prices', async (req, res) => {
  const data = req.body;
  prices
    .add(data)
    .then(() => {
      res.status(200).send('price added');
    })
    .catch((e) => res.status(400).send(e));
});

app.get('/products', async (req, res) => {
  try {
    const snapshot = await products.get();
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).send(list);
  } catch (e) {
    res.status(400).res.send(e);
  }
});

app.post('/add_product', async (req, res) => {
  const data = req.body;
  products
    .add(data)
    .then(() => {
      res.status(200).send('doc added');
    })
    .catch((e) => res.status(400).send(e));
});

app.get('/getByProductMarket', async (req, res) => {
  const data = req.body;
  try {
    const snapshot = await prices
      .where('product.id', '==', data.productId)
      .where('market.id', '==', data.marketId)
      .get();
    if (snapshot.docs.length === 0) {
      res.status(200).send({ data: 'no matching products in that market' });
    } else {
      const list = snapshot.docs.map((doc) => {     
        return {
          id: doc.id,
          market: doc.data().market.name,
          product: doc.data().product.name,
          retailPrice: doc.data().retailPrice,
          date:  new Date(doc.data().createdAt.seconds*1000)
        };
      });
      res.status(200).send({ data: list });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/getByProductMarketLatest', async (req, res) => {
  const data = req.body;
  try {
    const snapshot = await prices
      .where('product.id', '==', data.productId)
      .where('market.id', '==', data.marketId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    console.log(snapshot.docs);
    if (!snapshot) {
      res.status(200).send({ data: 'no matching products' });
    } else {
      const list = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      res.status(200).send({ data: list });
    }
  } catch (e) {
    console.log({ e });
    res.status(400).send(e);
  }
});

app.get('/getByProductMarketDate', async (req, res) => {
  const data = req.body;
  if (!data.date) data.date = Date.now();
  const dateStamp = firebase.firestore.Timestamp.fromDate(new Date(data.date));
  try {
    const snapshot = await prices
      .where('product.id', '==', data.productId)
      .where('market.id', '==', data.marketId)
      .where('createdAt', '<=', dateStamp)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    if (!snapshot) {
      res.status(200).send({ data: 'no matching products' });
    } else {
      const list = snapshot.docs.map((doc) => {
        console.log({ doc });
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      res.status(200).send({ data: list });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/get_price', async (req, res) => {
  const snapshot = await price
    .where('productId', '==', '2d0c2810-b302-11eb-9427-27c569a8e293')
    .get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
});

app.get('/pricesByUser', async (req, res) => {
  const user_id = req.query.user_id;
  // const date = req.query.date;
  // const dateStamp = firebase.firestore.Timestamp.fromDate(new Date());
  // const today = Date.now().toString();
  let headers = [];
  let products = [];
  let tableObj = {};
  try {
    const snapshot = await prices.where('userId', '==', user_id).get();
    if (!snapshot) {
      res.status(200).send({ data: 'no matching prices' });
    } else {
      const list = snapshot.docs.map((doc) => {
        if (!headers.includes(doc.data().market.name))
          headers.push(doc.data().market.name);
        if (!products.includes(doc.data().product.name))
          products.push(doc.data().product.name);
        if (!tableObj[doc.data().product.name])
          tableObj[doc.data().product.name] = [];
        return {
          market: doc.data().market,
          product: doc.data().product,
          price: doc.data().retailPrice,
        };
      });
      tableObj['headers'] = headers;
      let indObj = {};
      headers.map((item, index) => (indObj[item] = index));
      for (let mkt of Object.keys(tableObj)) {
        if (mkt !== 'headers') {
          let zeros = new Array(headers.length).fill(0);
          tableObj[mkt] = zeros;
        }
      }
      for (let val of list) {
        console.log({ val });
        if (val.market && val.product && val.price) {
          let ind = indObj[val.market.name];
          tableObj[val.product.name][ind] = val.price;
        }
      }
      return res.json({ tableObj });
    }
  } catch (e) {
    res.status(400).json({ e });
  }
});

app.get('/pricesByUserDate', async (req, res) => {
  const user_id = req.query.user_id;
  const dateStamp = firebase.firestore.Timestamp.fromDate(
    new Date(req.query.date)
  );
  let ms = new Date(req.query.date).getTime() + 86400000;
  let tomorrow = firebase.firestore.Timestamp.fromDate(new Date(ms));
  let headers = [];
  let products = [];
  let tableObj = {};
  try {
    const snapshot = await prices
      .where('userId', '==', user_id)
      .where('createdAt', '>', dateStamp)
      .where('createdAt', '<', tomorrow)
      .get();
    if (snapshot.docs.length === 0) {
      res.status(200).send({ data: 'no matching prices' });
    } else {
      const list = snapshot.docs.map((doc) => {
        if (!headers.includes(doc.data().market.name))
          headers.push(doc.data().market.name);
        if (!products.includes(doc.data().product.name))
          products.push(doc.data().product.name);
        if (!tableObj[doc.data().product.name])
          tableObj[doc.data().product.name] = [];
        return {
          market: doc.data().market,
          product: doc.data().product,
          price: doc.data().retailPrice,
        };
      });
      tableObj['headers'] = headers;
      let indObj = {};
      headers.map((item, index) => (indObj[item] = index));
      for (let mkt of Object.keys(tableObj)) {
        if (mkt !== 'headers') {
          let zeros = new Array(headers.length).fill(0);
          tableObj[mkt] = zeros;
        }
      }
      for (let val of list) {
        if (val.market && val.product && val.price) {
          let ind = indObj[val.market.name];
          tableObj[val.product.name][ind] = val.price;
        }
      }
      return res.json({ tableObj });
    }
  } catch (e) {
    res.status(400).json({ e });
  }
});
