var express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())

// my own middle ware function
const logger = (request,response,next) => {
    console.log('METHOD ',request.method,':',request.path)
    next()
}

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(logger)
morgan.token('post_resource',(request,response)=>{request.body})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_resource'))
app.get('/api/persons',(request,response)=>{
    console.log('/api/persons',persons)
    response.json(persons)
})

app.get('/api/persons/:id',(request,response)=>{
    console.log('get method called')
    const id = Number(request.params.id)
    const person = persons.find(person=>person.id===id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person=>person.id===id)
    if(person){
        console.log("person found proceeding to delete")
        persons.splice(id,1)
        response.status(200).json({'success':true,'status_msg':`deleted resource with id: ${id}`})
    }
    else{
        response.status(400).json({'success':false,'status_msg':`Unable to delete resource with id ${id},resource not found`})
    }
})

const generateID = () => {
    return Number(Math.random()*10000).toFixed(0)
}



app.post('/api/persons/',(request,response)=>{
    const id = generateID()
    if(Object.keys(request.body).length!==0){
        const newPerson = {
        ...request.body,
        id: id,
    }
    console.log('Adding new person',newPerson)
    persons.concat(newPerson)
    console.log(newPerson.name,newPerson.number)
    if(newPerson.name && newPerson.number){
        response.json(newPerson)
    }
    else{
        if(!newPerson.name){
            response.status(400).json({error:'Name is missing'})
        }
        else{
            const existing_person_found = persons.find(person=>person.name.toLowerCase()===newPerson.name.toLowerCase())
            if(existing_person_found){
                response.status(400).json({
                    error:'The name already exists in the phonebook'
                })
            }
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
    let currentDate = new Date()
    console. log(currentDate); 
    let response_format = `<p>Phonebook has info for ${persons.length} people</p>`+
                            `<p>${currentDate}</p>`
    response.send(response_format)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})


