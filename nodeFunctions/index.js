const express = require('express');
const cors = require('cors')({ origin: true });
const app = express();
const {
  prices,
  accounts,
  products,
  markets,
} = require('./firebase-config');

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Get markets
// Get districts/regions
// Get countries
// Get products
// Get product categories** Does not exist
// Get latestPrice (from market/product, product, or market)
// Get historicalPrice (from market/product, specify date)
// Get timeFramePrice (from market/product) ??
// Get coverage (product, markets, regions) ??

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

app.get('/get_latest_price', async (req, res) => {
  const data = req.body;
  try {
    const snapshot = await prices
      .where('productId', '==', data.productId)
      .where('marketId', '==', data.marketId)
      // .orderBy('createdAt').get()
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
  // const pricesRef = db.collection('prices');
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


