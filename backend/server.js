const app = require("./src/app")
const connect = require("./src/db/db")

const PORT = process.env.PORT || 3000

app.listen(3000, ()=>{
    console.log("server running on port no : ",3000);
    connect()
})