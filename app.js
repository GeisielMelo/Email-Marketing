// Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

// Create Express App
const app = express();

// Load static files.
app.use(express.static('assets'));
// Load body parser.
app.use(bodyParser.urlencoded({extended: true}));

// Create a route for the home page.
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/singup.html');
});

// Create a route for the post request.
app.post('/', function(req, res) {

    // Get inputs from the form.
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // Create a list of data to send to Mailchimp.
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // Convert data to JSON.
    const jsonData = JSON.stringify(data);

    // Send data to Mailchimp.
    const url = 'https://us21.api.mailchimp.com/3.0/lists/{Your List ID}';
    const options = {
        method: 'POST',
        auth: '{Your Username}:{Your API Key}'
    }

    const request = https.request(url, options, function(response) {

        // Redirect to the success page or failure page.
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', function(data) {
            // console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});


// Redirect to the main page on click Try Again!.
app.post('/failure', function(req, res) {
    res.redirect('/');
});


// Start the server
app.listen(3000, () => {
    console.log('listening on port 3000');
});
