const createError = require("http-errors");
let express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");



const dbConfig=require("./config/couchbase.config");
const couchbaseStore = require("./connector/couchbase_store");
const DatabaseAdapter=require("./connector/database_adapter");
let dbAdapter=new DatabaseAdapter({store:new couchbaseStore(dbConfig)});

let app = express();


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(3000, function () {
    console.log("Running sesion on port 3000" );
});
// console.log("app",app);
module.exports.app = app;
module.exports.dbAdapter = dbAdapter;
