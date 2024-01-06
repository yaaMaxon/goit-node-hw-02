// Password: p_EWLE7ab9Ph2rY
// mongodb+srv://Maksym:p_EWLE7ab9Ph2rY@cluster0.jhgjgyo.mongodb.net/
const app = require('./app');
const mongoose = require("mongoose");
require("dotenv").config();

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.connect(DB_HOST).then(() => {
    app.listen(PORT, () => {
     console.log("Database connection successful")
    })
}).catch(error => {
    console.log(error.message);
    process.exit(1);
});