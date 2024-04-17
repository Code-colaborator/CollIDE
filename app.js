const express = require("express")
const bcrypt = require('bcrypt');
const collections = require("./mongo")
const CodeFile = require('./CodeFile');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
const PORT = process.env.PORT || 5000;



app.get("/",cors(),(req,res)=>{

})

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/collide', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username or email
        const user = await collections.findOne({ $or: [{ email: username }, { username: username }] });

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

        // console.log("Stored Hashed Password:", storedSalt);
        // console.log("Hashed Password from Input:", hashedPassword);

        const checker= await bcrypt.compare(saltedPassword,user.password);

        // console.log("Checker:", checker);

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
        const userExists = await collections.findOne({ $or: [{ email: username }, { username: username }] });
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
        await collections.insertMany(userData);

        res.json("notexist");
    } catch (e) {
        console.error("Error:", e);
        res.json("fail");
    }
})

app.listen(8000,()=>{
    console.log("port connected");
})

// app.post('/create', async (req, res) => {
//     try {
//       const { filename, content, language } = req.body;
//       const newCodeFile = new CodeFile({
//         filename,
//         content,
//         language,
//       });
//       const savedFile = await newCodeFile.save();
//       res.status(201).send(savedFile);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   });
  
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
app.post('/create', async (req, res) => {
    try {
      const { filename, content, language } = req.body;
      const newCodeFile = new CodeFile({
        filename,
        content,
        language,
      });
      const savedFile = await newCodeFile.save();
      res.status(201).send(savedFile);
    } catch (error) {
      console.error('Error creating file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Define a GET endpoint to retrieve files
  app.get('/files', async (req, res) => {
    try {
      const files = await CodeFile.find();
      res.json(files);
    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  app.get('/files/:id', async (req, res) => {
    try {
      const fileId = req.params.id; // Extract file ID from the request params
  
      // Query the database to retrieve the file by ID
      const file = await CodeFile.findById(fileId);
  
      // If the file does not exist, return a 404 Not Found response
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Send the file content as a response
      res.json({ content: file.content });
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });