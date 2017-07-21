/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var http = require('http');
var url = 'http://api.openweathermap.org/data/2.5/weather?zip=98101&APPID=1e1fdbbbd0b6e9b797cf758f7a7836d0';
var json = {
    "Clear": {
        "Hot": ["Salad", "Ice Cream", "Barbecue", "Soup", "Prawn cocktail", "Burger", "Tomato", "Pizza"],
        "Cold": ["Pasta with pesto", "Chicken strips", "Chicken avocado wraps", "Double Bacon Burger", "Pad thai noodles", "Pizza", "Pizza Calzone"]
    },
    "Snow": {
        "Hot": ["Putin", "Gnocchi", "Beef", "Raclette", "Doner kebab", "Pizza"],
        "Cold": ["Putin", "Gnocchi", "Beef", "Raclette", "Doner kebab", "Pizza"]
    },
    "Rain": {
        "Hot": ["Burgers and chips", "Chicken and mushroom pie", "Beef ragout", "hot dog", "ham and cheese sandwich", "Pizza"],
        "Cold": ["Donuts", "Gyoza dumplings", "Kebab", "bratwurst", "Chow Mien", "Raviolli", "Pizza"]
    },
    "Clouds": {
        "Hot": ["Spaghetti", "Tagliatella", "Milanesa", "burrito", "Tapas", "Hot Dog", "Pizza"],
        "Cold": ["Flan", "Mousse", "Cake", "Pho", "Hot Pasta", "Croissant", "Pizza"]
    },
    "Extreme": {
        "Hot": ["Eat whatever you have in your fridge"],
        "Cold": ["Eat whatever you have in your fridge"]
    }
};
    function getWeather(zip, cb) {
    http.get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                console.log(parsedData);
                cb(null, parsedData);
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        cb(e);
    });
}

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Marriage Saver',
            GET_FACT_MESSAGE: "Here's my suggestion for your next meal: ",
            HELP_MESSAGE: 'You can say whats for dinner, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'American Space Facts',
        },
    },
    'en-GB': {
        translation: {
            SKILL_NAME: 'British Space Facts',
        },
    },
    'de': {
        translation: {
            SKILL_NAME: 'Weltraumwissen auf Deutsch',
            GET_FACT_MESSAGE: 'Hier sind deine Fakten: ',
            HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
        },
    },
};


const handlers = {
    'LaunchRequest': function () {
        this.emit('FoodChoice');
    },
    'FoodChoice': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data

        // Create speech output
        var parent = this;
        getWeather('Seattle',function(err, data) {
            let weather = data.weather[0].main;
            let temperature = (data.main.temp - 273.15).toFixed(1);
            let tempChoice = (temperature >= 20) ? 'Hot' : 'Cold';
            switch (weather) {
                case 'Thunderstorm':
                case 'Drizzle':
                case 'Additional':
                    weather = 'Rain';
                    break;
            }
            let items = json[weather][tempChoice];
            console.log(items);
            const index = Math.floor(Math.random() * items.length);
            console.log(index);
            let result = items[index];
            console.log(result);
            let sentence = 'Because the temperature is ' + temperature + ' degrees Celsius, and the weather is ' +
                data.weather[0].description +
                ', you should eat' + result;
            parent.emit(':tellWithCard', sentence, parent.t('SKILL_NAME'), sentence);
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.execute();
};
