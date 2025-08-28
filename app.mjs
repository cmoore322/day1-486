import express from 'express'
import path from 'path'


const app = express()
const PORT = process.env.PORT || 3000;

const path = require('path');

app.use(express.static(__dirname + 'public'))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/connor', (req, res) => {
  res.send('connor. <a href="/">home</a>')
  res.sendFile('connor.html')
  
})

app.get('/api/connor', (req, res) => {
    //res.send('connor, <a href="/">home</a>')
    const myVar = 'Hello from server!';
    res.json({ myVar });

    //res.sendFile('connor.html')
  })

  app.listen(PORT, () => {
    console.log(`Example app listening on ${PORT}`)
  })
