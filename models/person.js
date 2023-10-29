

const mongoose = require('mongoose')

const connectionString = process.env.CONNECTION_URI

mongoose.set('strictQuery',false)

mongoose.connect(connectionString)
.then(()=>{
    console.log('Connected to database')
})
.catch(error=>{
    console.log(error)
    console.log('Could n\'t connect to database')
})

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength:3,
        required:true,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(value){
                return /\d{2,3}-\d/.test(value)
            }
        },
        required: true
    },
})

const personModel = mongoose.model('Person',personSchema)


module.exports = personModel
