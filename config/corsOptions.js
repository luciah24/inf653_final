const allowedOrigins = require('./allowedOrigins'); 

const corsOptions = {
    origin: (origin, callback) => {

        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true) // if it matches an entry in your allowedOrigins list, the request is allowed 
        } else {
            callback(new Error('Not allowed by CORS')); // otherwise, throw an CORS error 
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;