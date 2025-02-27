# CHAT APP

## INTRODUCTION
This project is a real-time Chatting App which was built using the MERN Stack. The FrontEnd UI that the user communicates with is built using React, a Javascript Framework. All Data is stored in a MongoDB database, which is a NoSQL Database. ExpressJS framework is used to facilitate the building of REST APIs, which allow from the communication between our FrontEnd (Client) and BackEnd (Database). The Application is powered using Node.js Rutime and Node Package Manager is used to get the required libraries to build an Application powered by NodeJS.

## REQUIRED LIBRARIES
1. express : 
2. dotenv : 
3. mongoose : 
4. react-router-dom : 
5. jsonwebtoken : 
6. axios : 
7. socket.io : 
8. bcrypt : 
9. mongodb : 
10. cors : 

## PROJECT STRUCTURE AND SUMMARY
the project is divided into two parts, the FrontEnd and the BackEnd. The application is customised using TailwindCSS and React in the FrontEnd. Libraries such as Express and Mongoose enable the communication of our FrontEnd with the MongoDB database which has all user, message and chat data. 

## BACKEND 
The BackEnd of the project consists of 4 folders, which ensure that the user can interact with the database and perform CRUD (Create, Read, Update and Delete) oeprations with the Database.
- config : consists of files to configure mongoDB database connection and JWT token generation.
- Middleware : consists of Middleware to ensure that users can only access API routes to perform Controller functions only if they're authorised.
- Models : consists of the mongoDB structure of the data.
- Routes : this folder consists of the declaration of the API calls we make to perform interactions with the database using controllers
- Controllers : This consists of the functions that we perform as per the API calls of the user.
server.js

### STRUCTURE

```
├── backend
│   ├── config
│   │   ├── db.js
│   │   ├── generateToken.js
│   ├── Middleware
│   │   ├── authMiddleware.js
│   ├── Models
│   │   ├── ChatModel.js
│   │   ├── MessageModel.js
│   │   ├── UserModel.js
│   ├── Routes
│   │   ├── ChatRoute.js
│   │   ├── MessageRoute.js
│   │   ├── UserRoute.js
│   ├── Controllers
│   │   ├── ChatController.js
│   │   ├── MessageController.js
│   │   ├── UserController.js
├── server.js

```
### CONFIGURATION FILES (config)

There are two files for configure, db.js to setup the database connection and generateToken.js which is called upon later within our Controller for when a user signs in.

#### 1) DATABASE CONFIGURATION FILE (db.js)
This file consists of the relevant code, to connect our application to the mongoDB database.

Mongoose is the ODM(Object Data Modelling) Library which enables us to interact with MongoDB database. Our Environment variable declared in .dotenv file are also loaded into process.env here
```
const mongoose = require('mongoose');
require('dotenv').config()
```

strictQuery ensures only properties(fields) decalred in schemas can be manipulated and are allowed in queries.
The function connecttodatabase uses the connect function using the MONGODB_URI, which is the connection string environment variable.

```
mongoose.set("strictQuery", true, "NewUrlParser", true);

const connecttodatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log("Successfully connected to MongoDB database")
    } catch (err) {
        console.error(err.message)
        console.log(process.env.MONGODB_URI)
        process.exit(1)
    }
    
}

module.exports = connecttodatabase;
```

#### 2) GENERATING JWT TOKEN (generateToken.js)
This contains the code which generates a token upon user sign on. This token is cross checked whenever an action takes place for authentication purposes.
jsonwebtoken library is imported, and it contains the functions to generate a unique token for a user. The user's id (username/email) is taken in the sign method is used with the arguements
- { id } → The payload (data stored inside the token). This includes the user’s ID.
- process.env.JWT_SECRET → The secret key used to sign the token. It should be stored securely in the .env file to prevent exposure.
- { expiresIn: "30d" } → The token will expire in 30 days, meaning the user will need to log in again after that time.

```
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config()

const generateToken = (id) => {
  return jsonwebtoken.sign({id},process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

module.exports = generateToken
```

### MODELS 

These consists of files where we declare the structure of frequently used data structure i.e. Users, Messages and Chats.
(Only users is shown below as Users has special function which use bcrypt, Messages and Chats have their Schema declared as normal)

#### 1) userModel.js

In this File, moongoose is used to declare the Schema of the User. Bcrypt is used to perform two things
1. Ensure Passwords are comapred before user signs in.
2. Ensure that befire a usermodel is saved, (when a new user is created, or user details are changed)

First mongoose and bcryot libraries are declared so that they can be used
```
//import mongoose from 'mongoose';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
```

Mongoose Library Object's constructor method Schema is used to build an instance (object) of user Model.
```
const usermodel = mongoose.Schema({
    username: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
}, {
    timestamps:true
})
```

bycrypt library's method, compare is used to compare the password that the user entered and the hashed password that is stored in our database.
```
usermodel.methods.matchPassword = async function (passwordEntered) {
    return await bycrypt.compare(passwordEntered, this.password)
}
```


```
usermodel.pre( "save", async function (next) {

    if (!this.isModified){
        next() //if this instance of this object is not modified next skips the enxt few lines within this pre save function
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
```

```
const User = mongoose.model("User", usermodel);

module.exports = User;
```
## FRONTEND

STRUCTURE


Please visit this Link, Its the App! 

https://real-time-chat-app-mern-un4z.onrender.com/ 



