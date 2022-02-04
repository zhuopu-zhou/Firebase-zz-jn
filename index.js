const express = require("express");
const app = express();
app.use(express.json());

//import a set of tools to talk to firebase and Firebase
const {
  initializeApp,
  applicationDefault,
  getApps,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

//import our credentials
const credentials = require("./credentials.json");

// //connect to firebase service
function connectToFirestore() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(credentials),
    });
  }
  return getFirestore();
}

// //read a doc
const readProduct = async (id) => {
  const db = connectToFirestore();
  const doc = await db.collection("Products").doc(id).get();
  const res = doc.data();
  return res;
};

//read a collection
const readProducts = async () => {
  const db = connectToFirestore();

  const snapshot = await db.collection("Products").get();
  const products = snapshot.docs.map((doc) => {
    let product = doc.data();
    return product;
  });

  return products;
  // alter way
  // return db.collection("Products")
  //   .get()
  //   .then((snapshot) => {
  //     const products = snapshot.docs.map((doc) => {
  //       let product = doc.data();
  //       return product;
  //     });
  //     return products;
  //   });
};

// //update a doc
const updateDoc = async (product) => {
  const db = connectToFirestore();
  db.collection("Products")
    .doc(product[1].id)
    .update(product[0])
    .then(() => {
      console.log("Product Updated");
    })
    .catch((err) => {
      console.error(err);
    });
};

//create a doc
const addDoc = (product) => {
  const db = connectToFirestore();
  db.collection("Products")
    .add(product)
    .then((doc) => {
      console.log("Added Product", doc.id);
    })
    .catch((err) => {
      console.error(err);
    });
};

//read a whole collection
app.get("/collection/getall", async (req, res) => {
  const products = await readProducts();
  res.send(products);
});

//read a single doc
app.get("/collection/:id", async (req, res) => {
  //const { id } = req.body;
  const { id } = req.params;
  console.log(id);
  const product = await readProduct(id);
  res.send(product);
});

//add a doc to a collection
app.post("/collection/insertone", async (req, res) => {
  const product = req.body;
  await addDoc(product);
  res.send({ result: "success" });
});

//update a doc
app.patch("/collection/updateone", async (req, res) => {
  const product = req.body;
  await updateDoc(product);
  res.send({ result: "success" });
});

let PORT = 3001;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
