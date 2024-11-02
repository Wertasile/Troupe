const mongoose = require('mongoose')

const connectDB = async() => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{})
        console.log(`MongoDB Connected successfully connected ${conn.connection.host}`)
    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit()
    }
}

module.exports = connectDB
