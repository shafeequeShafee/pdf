const express = require("express");
const router = require("./router/router")
const app = express();
app.use(express.json());
app.use('/router',router);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Api running on port : http://localhost:${PORT}`);
});


