# NJSM Bot: Facebook Messenger NodeJS Chat Bot


Facebook recently opened up their Messenger platform to enable bots to converse with users through Facebook Apps and on Facebook Pages.

You can read the  [documentation](https://developers.facebook.com/docs/messenger-platform/quickstart) the Messenger team prepared but it's not very clear for beginners and intermediate hackers.

So instead here is how to create your own messenger bot in 15 minutes.

## Presentation

NJSM Bot is a NodeJS Based chat bot to configure with a messenger api. this project is using Messenger.

NJSM Bot receives a message and compare it with the key present in the "DB" (actually just a bunch of json placed in the 'conversation/db' folder) and get's a response from there and reply the client, If an answer is not found it redirects the message to [CleverBot API](https://cleverbot.io/) and the robot replies as an endependent brain, somtimes the answers are pretty lame so be carfull for professional use.

## Use

Pretty basic

1.	Clone the repo
    ```
    git clone
    ```
2.	get dependencies
	```
    npm install
    ```
3.	execute the project with
	```
    node index.js
    ```
4.	to deploy on heroku
    ```
    git add .
    git commit -m 'updated the bot to speak'
    git push heroku master
    ```

## Database

Lately I integrated the project with MongoDB, Storing Users pereferences like Language and Localisation, And persisting reservations and Orders.

```
conversation/bo/persistance.js
```

It's here where you find DB connection and Models Schemas and operacions
