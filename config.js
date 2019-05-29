/*const dotenv = require('dot-env');
const path = require('path');*/

/*const root = path.join.bind(this, __dirname);
dotenv.config( { path: root('.env') } );*/

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: /*process.env.MONGO_URL*/ 'mongodb://localhost:27017/final',
    SESSION_SECRET: /*process.env.SESSION_SECRET*/'dkjfgLkjkIkjdfnHD54SD',
    IS_PRODUCTION: process.env.NODE_ENV === 'production'
};