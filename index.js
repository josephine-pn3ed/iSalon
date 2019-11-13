
const express = require('express')
const app = express();
var http = require('http').createServer(app);
const path = require("path");
const items = require("./item");
var port = process.env.PORT || 3000;

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/salonList', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Now connected to MongoDB!'))
	.catch(err => console.error('Something went wrong', err));

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("we're connected")
});

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
})

app.get("/item/retrieve/all", function (req, res) {
	console.log("retrieving all...")
	const test2 = async function () {
		const elements = await items.getItems();
		res.send(elements)
	}
	test2();
})

app.put("/item/create", function (req, res) {
	console.log("creating...");
	req.on('data', function (req) {
		store = JSON.parse(req);
		const test2 = async function () {
			const exist = await items.getByName(store.customer);
			console.log(exist)
			if (exist.length == 0) {
				const data = {
					customer: store.customer,
					age : store.age,
					service: store.service,
					price: Number((store.price).toFixed(1))
				}
				await items.addPerson(data);
				const item = await items.getLastItem();
				res.send(item)
			}
			else {
				res.send("Customer existed!")
			}
		}
		test2();
	});
	req.on('end', function () { })
})



app.get("/item/retrieve/:id", function (req, res) {
	console.log("retrieving...");
	const test = async function () {
		console.log(req.params.id)
		const result = await items.findItem(req.params.id);
		res.send(result);
	}
	test();
})

app.post("/item/update", function (req, res) {
	console.log("updating...");
	req.on('data', function (req) {
		store = JSON.parse(req);
		console.log(store.id);
		const test = async function () {
			const result = await items.updateItem(store.id, store.service, Number((store.price).toFixed(1)));
			const updated = await items.findItem(store.id);
			res.send(updated);
		}
		test();
	})
	req.on('end', function () { })
})

app.delete("/item/delete", function (req, res) {
	console.log("deleting...");
	req.on('data', function (req) {
		store = JSON.parse(req);
		res.send("success")
		const test2 = async function () {
			const p = await items.deleteItem(store.id);
			console.log(p);
		}
		test2();
	});
	req.on('end', function () { })
})

app.use(express.static('assets'));

http.listen(port, function () {
	console.log("Connected!")
})