const express = require("express")
const bcrypt = require('bcrypt');
const collection = require("./mongo")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())



app.get("/",cors(),(req,res)=>{

})


app.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username or email
        const user = await collection.findOne({ $or: [{ email: username }, { username: username }] });

        // Check if user exists
        if (!user) {
            return res.json("notexist");
        }

        // Extract salt and hashed password from the user object
        const storedSalt = user.salt;
        const storedHashedPassword = user.password;

        // Combine the retrieved salt with the entered password and hash the combined string
        const saltedPassword = storedSalt + password;
        const hashedPassword = await bcrypt.hash(saltedPassword, 10);

        console.log("Stored Hashed Password:", storedSalt);
        console.log("Hashed Password from Input:", hashedPassword);

        const checker= await bcrypt.compare(saltedPassword,user.password);

        console.log("Checker:", checker);

        // Compare the hashed result with the stored hashed password
        if (checker) {
            res.json("exist");
        } else {
            res.json("notmatch");
        }
    } catch (error) {
        console.error("Error:", error);
        res.json("fail");
    }
})



app.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await collection.findOne({ $or: [{ email: username }, { username: username }] });
        if (userExists) {
            return res.json("exist");
        }

        // Generate a random salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Append the salt to the front of the password
        const saltedPassword = salt + password;

        // Hash the salted password
        const HashedPassword = await bcrypt.hash(saltedPassword, saltRounds);

        // Create user data object with email, username, salt, and hashed password
        const userData = {
            email: email,
            username: username,
            salt: salt,
            password: HashedPassword
        };

        // Store the user data in the database
        await collection.insertMany(userData);

        res.json("notexist");
    } catch (e) {
        console.error("Error:", e);
        res.json("fail");
    }
})

app.listen(8000,()=>{
    console.log("port connected");
})

