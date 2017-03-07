'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
var tools = require('./tools')
var main = require('./conversations/main')

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function(req, res) {
    if (req.query['hub.verify_token'] === 'this_is_a_token') {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('hello world i am a secret bot')
    }
})

// to post data
app.post('/', function(req, res) {
  main.manage(req,res);
})

// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
