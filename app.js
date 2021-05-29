const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
const url= "mongodb+srv://shubhrima:"+process.env.PASSWORD+"@cluster0.mjoba.mongodb.net/booksDB";


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  rating: String,
});

const Book = mongoose.model('Book', bookSchema);	//model

app.route('/books')
.get(
	(req, res) => {
  Book.find(function(err, foundBooks){
  	if (!err)
  	{
  		res.send(foundBooks);
  	}
  	else
  	{
  		res.send(err);
  	}
  	
  })
})
.post(
	(req, res) => {

  const newBook = new Book({
  	title: req.body.title,
  	author: req.body.author,
  	rating: req.body.rating,
  });
  newBook.save();

  if (!err)
  {
  	res.send('Successfully added');
  }
  else
  {
  	res.send(err);
  }
});

app.get('/books/:book', function(req,res){

     var query = { 'title' : req.params.book };

    Book.findOne(query, function(err, item) {
            res.send(item);
        });
});

app.patch('/books/:book', (req, res) => {
	Book.updateOne(
		{ 'title' : req.params.book },
		{$set : req.body},
		function(err, item) 
		{
			if (!err)
			{
				res.send(item);
			}
            console.log(err);
        });

});

app.delete('/books/:book', (req, res) => {
	Book.deleteOne(
		{ 'title' : req.params.book },
		function(err, item) 
		{
			if (!err)
			{
				res.send(item);
			}
            console.log(err);
        });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){

  console.log("Server working fine!");
})
