var mongoose = require('mongoose')
var data = {}
var password = null
var mode = 'display'
if(process.argv.length==3){
    mode='display'
    password = process.argv[2]
}
else if(process.argv.length==5){
    
    mode='create'
    password = process.argv[2]
    data = {
        'name': process.argv[3],
        'number': process.argv[4],
    }
}

const get = async(model)=>{
    return await model.find({}).then(result=>{
        mongoose.connection.close()
        result.forEach(person=>{
            console.log(person.name,person.number)
        })
        return result
    }).catch(err=>{
        console.log(err)
    })
}



const create = async(model,data) => {
    const modelObject = new model(data)
    return await modelObject.save().then(result=>{
        mongoose.connection.close()
        console.log('Saved successfully',data)
        return result
        
    }).catch(err=>{
        console.log(err)
    })
}



if(password){
    const connectionString = `mongodb+srv://purpleowlcodes:${password}@cluster0.dxktq8n.mongodb.net/phonebook?retryWrites=true&w=majority`
    console.log('trying to connect ',connectionString)
    mongoose.set('strictQuery',false)
    mongoose.connect(connectionString).then(()=>{
        console.log('Connected')
    })
    const person = mongoose.Schema({
        name: String,
        number: String,
    })
    const personModel = mongoose.model('person',person)

    if(mode==='display'){
        get(personModel)
    }
    else if(mode==='create'){
        if(data){
            console.log('creating data',data)
            create(personModel,data)
        }
        else{
            console.log('data is empty')
        }
    }


}
else{
    console.log('Please specify password')
}
