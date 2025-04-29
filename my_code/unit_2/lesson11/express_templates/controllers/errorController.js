const httpStatus = require("http-status-codes");

exports.logErrors = (error, req, res, next) => {
    //log the error trace stack to the console
    console.error(error.stack);
    //pass error object to next middleware 
    //function for further processing
    next(error);
};

exports.respondNoResourceFound = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND; //404 error
    res.status(errorCode);
    res.sendFile(`./public/${errorCode}.html`, { root: "./" });
};

exports.respondInternalError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR; //500 error
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);
    res.sendFile("./public/500.html", { root: "./" });
};