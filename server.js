const express = require('express')
const app = express()
const cors = require('cors')
const database = require('./Database')
const mongoose = require('mongoose')
require('dotenv').config();

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DATABASE)
.then(() => console.log('Connected to Database Successfully'))



app.post('/signup', async(req, res) => {
    const {firstname, lastname, email, password} = req.body
    console.log(req.body);
    const user = await database.userModel.findOne({email : email})

    if(user) res.send('user')
    else{
        database.userModel.create({
            firstname : firstname,
            lastname : lastname, 
            email : email, 
            password : password,
            date : new Date(Date.now())
        })
        .then(() => res.send(true))
    }

})

app.post('/signin', async(req, res) => {
    const {email, password} = req.body
    
    await database.userModel.findOne({email : email})
    .then((data, err) => {

        if(data && data.password === password){

            res.send(data)

        }
        else res.send(false)
    })

})

app.post('/add', async(req, res) => {
    const {task, id} = req.body
    await database.userModel.updateOne(
        {_id : id},
        {$push : {
            todos: {
                todo : task,
                date : new Date(Date.now()),
                status : true
            }
        }}
    )
    .then((data, err) => {
        if(data) res.send(data); 
        else res.send(false)
    })
})

app.post('/read', async(req, res) => {
    const {id} = req.body
    await database.userModel.find({_id : id})
    .then((data, err) => {
        if(data) res.send(data);
        else res.send(false);
    })

})

app.put('/update/:userId', async(req, res) => {
    const {update, todoId} = req.body
    await database.userModel.updateOne(
        {_id : req.params.userId , "todos._id" : todoId},
        {$set : { "todos.$.todo" : update}}
    ).then((data, err) => {
        if(data) res.send(true)
        else res.send(false)
    })
  
    
})

app.post('/complete', async(req, res) => {
    const {userId, id} = req.body
    await database.userModel.updateOne(
        {_id : userId , "todos._id" : id},
        {$set : { "todos.$.status" : false}}
        
    )
    .then((data, err) => {
        if(data) {
            res.send(true)
        }else res.send(false)
    })

})

app.post('/delete', async(req, res) => {
    const {userId, id} = req.body
    await database.userModel.findByIdAndUpdate(userId,
        {$pull : {todos : {_id : id}}}
        
    )
    .then((data, err) => {
        if(data) {
            res.send(true)
        }else res.send(false)
    }) 

})


app.listen(3001, () => {console.log('Started')})