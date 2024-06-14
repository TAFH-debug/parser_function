const axios = require("axios");
const mongoose = require("mongoose");
const { JSDOM } = require("jsdom");

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
});

const productModel = mongoose.model('product', ProductSchema);

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://aushahman2007:aushahman2A@cluster0.gnukjpm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

function main(args) {
    const getData = async() => {
        await connectDB();
        const res = await axios.get('https://www.olx.kz/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0',
            }
        });

        const dom = new JSDOM(res.data);
        const array = dom.window.document.getElementsByClassName("css-to3eky");
        for(const  i of array) {
            const title = i.querySelector(".css-z3gu2d").textContent;
            let price = i.querySelector("[data-testid=\"ad-price\"]").textContent;

            if (!price) price = "not specified";

            await new productModel({
                title,
                price
            }).save();
        }
        console.log("Lol")
    }
    getData();
}

exports.main = main
