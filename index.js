require('dotenv').config()
var express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const personModel = require('./models/person')
const app = express()

const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())


const errorHandler = (error,request,response,next)=>{
    console.log('error',error.name,typeof error.name)
    console.log(error)
    if(error.name==='ValidationError'){
        response.status(400).json({error:error.message})
    }
    next(error)
}
// my own middle ware function
const logger = (request,response,next) => {
    console.log('METHOD ',request.method,':',request.path)
    next()
}

app.use(express.json())
app.use(logger)


morgan.token('post_resource',(request,response)=>{request.body})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_resource'))
app.get('/api/persons',(request,response)=>{
    personModel.find({}).then(persons=>{
        response.json(persons)
    })
    
})

app.get('/api/persons/:id',(request,response)=>{
    console.log('get method called')
    const id = new mongoose.Types.ObjectId(request.params.id)
    personModel.findById(id).then(person=>{
        response.json(person)
    })
    .catch(error=>{
        response.status(404).end()
    })
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = new mongoose.Types.ObjectId(request.params.id)
    // const person = persons.find(person=>person.id===id)
    if(id){
        personModel.findByIdAndRemove(id).then(result=>{
            response.status(204).json({'success':true,'status_msg':`deleted resource with id: ${id}`})
            console.log("person found proceeding to delete")
        })
        .catch(error=>{
            console.log(error)
            response.status(400).json({'success':false,'status_msg':`Unable to delete resource with id ${id},resource not found`})
        })
        
    }
    else{
        response.status(400).json({'success':false,'status_msg':`Unable to delete resource with id ${id},resource not found`})
    }
})

const generateID = () => {
    return Number(Math.random()*10000).toFixed(0)
}

app.put('/api/persons/:id',(request,response)=>{
    const id= new mongoose.Types.ObjectId(request.params.id)
    const data = request.body
    personModel.findByIdAndUpdate(id,data,{new:true}).then(updatedNote=>{
        response.json(updatedNote)
    })
})


app.post('/api/persons/',(request,response,next)=>{
    const id = generateID()
    if(Object.keys(request.body).length!==0){
        const newPerson = {
            ...request.body,
            // id: id,
        }
        console.log('Adding new person',newPerson)
        
            if(newPerson.name && newPerson.number){
                const newPersonModel  = new personModel(newPerson)
                console.log(personModel)
                newPersonModel.save().then(person=>{
                    response.json(person)
                })
                .catch(error=>{
                    
                    next(error)
                })
                
            }
            else{
                if(!newPerson.name){
                    response.status(400).json({error:'Name is missing'})
                }
                if(!newPerson.number){
                    response.status(400).json({error:'Number is missing'})
                }
            }
        
        

    }
    else{
        response.status(400).json({error:'Data missing'})
    }
    
})

app.get('/info',(request,response)=>{
    personModel.find({}).then(persons=>{
        currentDate = new Date()
        length = persons.length
        let response_format = `<p>Phonebook has info for ${length} people</p>`+
                            `<p>${currentDate}</p>`
        response.send(response_format)
    }).catch(error=>{
        console.log(error)
        response.status(404).json(error)
    })
    
})
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})


