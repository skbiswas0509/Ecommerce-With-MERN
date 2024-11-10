const data = {
    users: 
    [
        {
        name: 'ab biswas',
        email: 'ab@121.yahoo.com',
        password: '1234',
        phone: '12345',
        address: 'Dhaka, BD',
        image: 'default.jpg',
    },
    {
        name: 'afdasdad sdad',
        email: 'afdfdb@2223.yahoo.com',
        password: '12345',
        phone: '123456',
        address: 'Rajshahi, BD',
        image: 'default.jpg',
    },
    ]
};

const products = [
    {
        name: "Laptop",
        slug: "laptop",
        description: "High performance laptop.",
        price: 1200,
        qunatity: 50,
        sold: 10,
        shipping: 1,
        image: Buffer.from(""),  // Add valid image data if you have it
        category: new mongoose.Types.ObjectId()  // Replace with a valid category ObjectId
    },
    {
        name: "Smartphone",
        slug: "smartphone",
        description: "Latest smartphone with all features.",
        price: 900,
        qunatity: 100,
        sold: 20,
        shipping: 1,
        image: Buffer.from(""),  // Add valid image data if you have it
        category: new mongoose.Types.ObjectId()  // Replace with a valid category ObjectId
    },
    {
        name: "Headphones",
        slug: "headphones",
        description: "Noise-canceling over-ear headphones.",
        price: 200,
        qunatity: 75,
        sold: 15,
        shipping: 0,
        image: Buffer.from(""),  // Add valid image data if you have it
        category: new mongoose.Types.ObjectId()  // Replace with a valid category ObjectId
    }
];


module.exports = {data, products};