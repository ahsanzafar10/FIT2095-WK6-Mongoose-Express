// Express configuration
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.listen(8080);

// Mongoose configuration
let mongoose = require('mongoose');
let DB_URL = 'mongodb://localhost:27017/exam_library_wk6';
let print = console.log
let Author = require('./models/author');
let Book = require('./models/book');
const book = require('./models/book');

mongoose.connect(DB_URL, function(err){
    if (err) print(err);
    else {
        print("Connected to DB successfully");
    }
});

// Middleware
app.use(bodyParser.urlencoded({extended: false}));

// Endpoints
app.get('/', function(req, res){
    res.sendFile(__dirname + "/views/index.html");
})

app.get('/newauthor', function(req, res){
    res.sendFile(__dirname + "/views/newauthor.html");
});

app.get('/listauthors', function(req, res) {
    Author.find({}, function(err, docs){
        res.render("listauthors.html", {ar: docs})
    })
});

app.get('/newbook', function(req, res){

    let rand_num = Math.floor((Math.random()*10000000000000)+1);
    res.render("newbook.html", {num: rand_num});
    
});

app.get('/listbooks', function(req, res){

    Book.find({}).populate('author').exec(function (err, docs){
        res.render("listbooks.html", {ar: docs})
       
    })
});

app.get("/deletebook", function(req, res){
    res.sendFile(__dirname + "/views/deletebook.html");
});

app.get("/updateauthor", function(req, res){
    res.sendFile(__dirname + "/views/updateauthor.html");
});

app.post("/updateauthorpost", function(req, res){
    Author.findByIdAndUpdate( {_id: req.body.authorID}, {$set: {numbooks: req.body.newnumbooks}}, function(err, docs) {
        if (err) res.redirect("/updateauthor");
        else res.redirect("/listauthors");
    })
})




app.post("/deletebookpost", function(req, res){
    print(req.body);
    Book.deleteOne( {isbn: req.body.ISBN}, function(err, docs){
        res.redirect('/listbooks')
        }
    );
})

app.post("/newbookpost", function(req, res){

    bookDetails = req.body;

    let book = new Book({
        _id: mongoose.Types.ObjectId(),
        title: bookDetails.title,
        author: mongoose.Types.ObjectId(bookDetails.author),
        isbn: bookDetails.ISBN,
        date: new Date(bookDetails.date),
        summary: bookDetails.summary
    });

    book.save(function(err){
        if (err) res.redirect("/newbook");
        else {
            // Update author books by one
            Author.findByIdAndUpdate(
                {_id: mongoose.Types.ObjectId(bookDetails.author)},
                {$inc: {numbooks: 1}},
                function(err, result) {
                    res.redirect("/listbooks");
                }

            )
        }
    });


});


app.post('/newauthorpost', function(req, res){
    authorDetail = req.body;

    let author = new Author({
        _id: mongoose.Types.ObjectId(),
        name: {
            firstname: authorDetail.firstname,
            lastname: authorDetail.lastname
        },
        dob: new Date(authorDetail.dob),
        address: {
            state: authorDetail.state,
            suburb: authorDetail.suburb,
            street: authorDetail.street,
            unit: authorDetail.unit
        },
        numbooks: authorDetail.numbooks
    });

    author.save(function(err){
        if (err) res.redirect('/newauthor');
        else res.redirect("/listauthors");
    });
})
