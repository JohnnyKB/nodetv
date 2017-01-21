const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

// APP SETTINGS
app.set('views', './src/views');
app.set('view engine', 'pug');


app.get('/', (req, res) => {
  res.send(`You've reached the call center`);
})

app.get('/pug', (req, res) => {
  res.render('test', {
    name: 'johnny',
    age: '27',
    message: 'Whazzap',
    title: 'my title'
  })
})

app.listen(port, function(err){
    console.log(`The server is running on port ${port}`);
})
