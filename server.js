const express = require("express")
const nunjucks = require("nunjucks");
const path = require('path');
const cors = require("cors")
const app = express()

// app.use(cors({
//     origin: '*',
//     credentials:true,
// }))
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))

nunjucks.configure("views", { autoescape: true, express: app });
let port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.render("home.html")
})

app.listen(port, () => {
    console.log("running on port ",port)
})