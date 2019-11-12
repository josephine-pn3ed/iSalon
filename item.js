const mongoose = require("mongoose");
var Schema = new mongoose.Schema({
   customer: {type:String, required:true},
   age: {type:String, required:true},
   service: {type: String, required: true},
   price: {type: Number, required: true}
});

Schema.statics.addPerson = async function (person){
   var Person = new this(person);
   var result =  await Person.save(person);
   return result;
}

Schema.statics.findItem = async function (id) {
	return await this.findOne({_id: id});
}

Schema.statics.getItems = async function() {
   return await this.find();
}

Schema.statics.getLastItem = async function() {
   return await this.find().sort({_id:-1}).limit(1);
}

Schema.statics.getByName = async function(name) {
   return await this.find({customer: name});
}


Schema.statics.updateItem = async function(id, newService, newPrice) {
   return await this.updateOne({_id: id},{$set: {service: newService, price: newPrice}});
}

Schema.statics.deleteItem = async function (id) {
   return await this.deleteOne({_id: id});
}

module.exports = mongoose.model('person', Schema);