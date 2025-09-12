const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { object } = require("joi");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main().then(()=>{console.log('Connected');
}).catch((err)=>{console.log(err);});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map( (object) => ({
        ...object,
        owner: "68c261732a716d929b451f0c"
    }));

    await Listing.insertMany(initData.data);
    console.log('Data was initialized');
}
initDB();