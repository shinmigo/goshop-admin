'use strict';

let HOST = process.argv.splice(2)[0] || 'dev';
let API_URL = "";

if (HOST == "test" || HOST == "prod" || HOST == "dev" || HOST == "preview") {
    API_URL = "/";
}

module.exports = {
    NODE_ENV: '"production"',
    API_ROOT: '"'+ API_URL + '"',
};