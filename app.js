require("./db")
const express = require("express")
const app = express();
const cors = require("cors")
const routeAuth = require("./routeAuth")
const Login = require('./Model/LoginModel')
const Cart = require('./Model/CartModel')
const RoomService = require('./Model/RoomServiceModel');
const Viewroom = require("./Model/ViewroomModel");
const Enquiries = require("./Model/EnquiryModel");
const { default: mongoose } = require("mongoose");
const CustomerModel = require("./Model/UserModel")
const FuserModel = require("./Model/FuserModel")
const jwt = require("jsonwebtoken")
const tok = require("jsonwebtoken")
const AdminModel = require("./Model/AdminModel");
const adminAuth = require("./adminAuth")
const Order = require("./Model/OrderModel");
const UserModel = require("./Model/UserModel");
const routeAuth1 = require('./routeAuth1')

app.use(cors())
app.use(express.json())
app.use(require('./routes/cartRoutes'));
app.use(require("./routes/confirmbooking"))
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});


//-------------------------------------------------

//Adminlogin---------------------
app.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminModel.findOne({ email });

  if (!admin || admin.password !== password) {
    return res.status(400).json({ message: "Invalid admin credentials" });
  }

  const payload = { user: { id: admin._id } };
  const token = jwt.sign(payload, "adminsecret", { expiresIn: "1h" });

  res.json({ message: "Admin login successful", token });
});
// -------------------UserLogin
//Signin
app.post("/signin", async (req, res) => {
    const {email, password, cpassword} = req.body;
    let exist = await FuserModel.findOne({email: email})

    //already exists
    if(exist){
        return res.status(400).json({ message: "Email already exist"})
    }
    //password confirmation
    if (password !== cpassword){
        return res.status(400).json({ message: "Password and Confirm Password doesn't match "})
    }

    const signup = new FuserModel(req.body)
    const result = await signup.save();
    res.json({ message: "Signup Successfull",result: result })
})

//CustomerLogin
 app.post("/Ulogin", async (req, res) => {
    const {email, password} = req.body;
    const exists = await  FuserModel.findOne({ email: email});
    if(!exists){
        return res.status(400).json({message: "Email doesn't exist"})
    }
    //password match
    if(exists.password !== password){
        return res.status(400).json({message: "Password doesn't match"})
    }

    //payload

    const payload = {
        user: {
            id: exists._id,
        }
    }

    // jwt creations
    const token = tok.sign(payload,"hotel",{expiresIn:'1h'})
    res.json({message: "Login Successful", token: token})
    })

    //protected route
    app.get("/fuser", routeAuth,  async (req, res) => {
        const exists = await FuserModel.findOne({_id:req.user.id})
        if (!exists) {
            return res.status(400).json({ message : "You are not authorized"})
        }
        else{
            res.json(exists)
        }
    })


    

// ---------------------------------------


//Signup
app.post("/signup", async (req, res) => {
    const {email, password, cpassword} = req.body;
    let exist = await CustomerModel.findOne({email: email})

    //already exists
    if(exist){
        return res.status(400).json({ message: "Email already exist"})
    }
    //password confirmation
    if (password !== cpassword){
        return res.status(400).json({ message: "Password and Confirm Password doesn't match "})
    }

    const signup = new CustomerModel(req.body)
    const result = await signup.save();
    res.json({ message: "Signup Successfull",result: result })
})

//CustomerLogin
 app.post("/Clogin", async (req, res) => {
    const {email, password} = req.body;
    const exists = await  CustomerModel.findOne({ email: email});
    if(!exists){
        return res.status(400).json({message: "Email doesn't exist"})
    }
    //password match
    if(exists.password !== password){
        return res.status(400).json({message: "Password doesn't match"})
    }

    //payload

    const payload = {
        user: {
            id: exists._id,
        }
    }

    // jwt creations
    const token = jwt.sign(payload,"adminsecret",{expiresIn:'1h'})
    res.json({message: "Login Successful", token: token})
    })

    //protected route
app.get("/dashboard",adminAuth, async (req, res)=> {
    const exists =await AdminModel.findOne({_id:req.user.id})
    if(!exists){
        return res.status(400).json({message: "You are not authorized"})
    }
    else{
        res.json(exists)
    }
})

//---------------------------------------------

//---------------------------------------------
// Enquiries

app.post('/Enquiries', async (req, res) =>{
    console.log("Received body:", req.body);
    const enquiries = new Enquiries(req.body);
    const result = await enquiries.save();
    res.send(result)
})



app.get('/Enquiries', async (req, res) =>{
    const enquiries = await Enquiries.find()
    if(enquiries.length > 0){
        res.send(enquiries)
    }
    else{
        res.send("No enquiries found")
    }
})



app.get('/Enquiries/:_id', async (req, res) =>{
    const _id = req.params._id;
    const enquiries = await Enquiries.findOne({_id: _id})
    res.send(enquiries)
})


app.delete('/Enquiries/:_id', async (req, res) =>{
    const _id = req.params._id;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId'});
    }
    const enquiries = await Enquiries.deleteOne({_id: _id})
    res.send(enquiries)
})

app.put('/Enquiries/:_id', async (req, res) =>{
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId format'});
    }
    const enquiry = await Enquiries.updateOne({ _id}, {$set: req.body})
    res.send(enquiry)
})

// ------------------------------------------------------------------------//

// Viewroom --- Put

app.put('/Viewroom/:_id', async (req, res) =>{
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId format'});
    }
    const viewroom= await Viewroom.updateOne({ _id}, {$set: req.body})
    res.send(viewroom)
})


// Viewroom ----- Post
app.post('/Viewroom', async (req, res) =>{
    console.log("Received body:", req.body);
    const viewroom = new Viewroom(req.body);
    const result = await viewroom.save();
    res.send(result)
})

// Viewroom ----- Get
app.get('/Viewroom', async (req, res) =>{
    const viewroom = await Viewroom.find()
    if(viewroom.length > 0){
        res.send(viewroom)
    }
    else{
        res.send("No viewroom found")
    }
})

// Viewroom --- GetOne
app.get('/Viewroom/:_id', async (req, res) =>{
    const _id = req.params._id;
    const viewroom = await Viewroom.findOne({_id: _id})
    res.send(viewroom)
})

// Viewroom --- DeleteOne
app.delete('/Viewroom/:_id', async (req, res) =>{
    const _id = req.params._id;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId'});
    }
    const viewroom = await Viewroom.deleteOne({_id: _id})
    res.send(viewroom)
})


//---------------------------------------------------------------------//

//RoomService --- Post
app.post('/roomservices', async (req, res) => {
    try{
        const service = new RoomService({
            name: req.body.name,
            description : req.body.description,
            text: req.body.text
        });
        const result = await service.save();
        res.send(result);
    } catch (err){
        res.status(500).send({error: 'Failed to save service'})
    }
})

// Get all services
app.get('/roomservices', async (req, res) => {
    try { 
        const services = await RoomService.find();
        res.send(services);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch services' });
    }
});

//  Get one service by ID
app.get('/roomservices/:_id', async (req, res) => {
    try {
        const service = await RoomService.findOne({ _id: req.params._id });
        res.send(service);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch service' });
    }
});

//  Delete a service
app.delete('/roomservices/:_id', async (req, res) => {
    try {
        const result = await RoomService.deleteOne({ _id: req.params._id });
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete service' });
    }
});

//  Update a service
app.put('/roomservices/:_id', async (req, res) => {
    try {
        const result = await RoomService.updateOne(
            { _id: req.params._id },
            { $set: { name: req.body.services, description: req.body.description, text: req.body.text } }
        );
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update service' });
    }
});

// ------------------------------------------ Login -------------------------------------------
// POST /Login - Save new login
app.post('/Login', async (req, res) => {
  const { user, email, password } = req.body;

  // Basic validation
  if (!user || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    const loginEntry = new Login({ user, email, password });
    const savedEntry = await loginEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save login entry.' });
  }
});

// GET /Login - Optional, list all login entries
app.get('/Login', async (req, res) => {
  try {
    const entries = await Login.find();
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve entries.' });
  }
});


// -------------------------------------- Cart ------------------------------------------

app.post('/Cart', routeAuth1, async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;

  // either update or insert cart
  let cart = await Cart.findOne({ userId });
  if (cart) {
    cart.items = items;
    await cart.save();
  } else {
    cart = new Cart({ userId, items });
    await cart.save();
  }

  res.send(cart);
});




app.get('/Cart/:_id', async (req, res) =>{
    const _id = req.params._id;
    const cart = await Cart.findOne({_id: _id})
    res.send(cart)
})


app.delete('/Cart/:_id', async (req, res) =>{
    const _id = req.params._id;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId'});
    }
    const cart = await Cart.deleteOne({_id: _id})
    res.send(cart)
})

//-----------------------------------
app.get('/mycart', routeAuth1, async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId });

  if (!cart) return res.json({ items: [] });

  res.json(cart);
});

app.delete("/deletecart/:itemId", routeAuth1, async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Filter out the item to delete
    const updatedItems = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    // If no item was removed
    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items = updatedItems;
    await cart.save();

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
//-----------------------Order----------------------

app.post('/Order', async (req, res) => {
    console.log("Recevied body:", req.body);
    const order = new Order(req.body);
    const result = await order.save()
    res.send(result)
})

app.get('/Order', async (req, res) =>{
    const order  = await Order.find()
    if(order.length > 0){
        res.send(order)
    }
    else{
        res.send("No order found")
    }
})



app.get('/Order/:_id', async (req, res) =>{
    const _id = req.params._id;
    const order = await Order.findOne({_id: _id})
    res.send(order)
})


app.delete('/Order/:_id', async (req, res) =>{
    const _id = req.params._id;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId'});
    }
    const order = await Order.deleteOne({_id: _id})
    res.send(order)
})

app.put('/Order/:_id', async (req, res) =>{
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId format'});
    }
    const order = await Order.updateOne({ _id}, {$set: req.body})
    res.send(order)
})

//------------------------------------------
app.get("/mybookings", routeAuth1, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});


app.listen(5000, ()=>console.log('API Created'))