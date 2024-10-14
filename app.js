const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json()); // Middleware for parsing JSON
app.use(express.static('public')); // Serve static files from public folder

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/eventConnect')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cart Schema
const CartSchema = new mongoose.Schema({
    userId: String, // Assuming a simple userId for now
    cartItems: [
        {
            serviceId: mongoose.Schema.Types.ObjectId, // Reference to ServiceProvider
            name: String,
            service: String,
            price: Number, // Price stored as Number (Int32)
            description: String,
            contact: String,
            location: String,
            quantity: { type: Number, default: 1 }
        }
    ]
});

const Cart = mongoose.model('Cart', CartSchema);

// Add to Cart API
app.post('/api/cart', async (req, res) => {
    const userId = 'user123'; // Hardcoded userId for simplicity
    const provider = req.body;

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, cartItems: [] });
    }

    // Check if the service provider is already in the cart
    const existingItemIndex = cart.cartItems.findIndex(item => item.serviceId.toString() === provider._id);
    
    if (existingItemIndex > -1) {
        // If it exists, increment the quantity
        cart.cartItems[existingItemIndex].quantity += 1;
    } else {
        // Otherwise, add the new item with quantity 1
        cart.cartItems.push({
          serviceId: provider._id,
          name: provider.name,
          service: provider.service,
          price: provider.price,
          description: provider.description,
          contact: provider.contact,
          location: provider.location,
          quantity: 1 // Initial quantity should be set to 1
      });
      
    }

    await cart.save();
    res.status(201).send({ message: 'Added to cart', cart });
});

// Get Cart Items API
app.get('/api/cart', async (req, res) => {
    const userId = 'user123'; // Hardcoded userId for simplicity
    const cart = await Cart.findOne({ userId });
    res.send(cart ? cart.cartItems : []);
});

// Remove from Cart function
app.delete('/api/cart/remove/:serviceId', async (req, res) => {
    const { serviceId } = req.params;
    const userId = 'user123'; // Hardcoded userId for simplicity

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const existingItemIndex = cart.cartItems.findIndex(item => item.serviceId.toString() === serviceId);
    if (existingItemIndex > -1) {
        // Decrease quantity
        if (cart.cartItems[existingItemIndex].quantity > 1) {
            cart.cartItems[existingItemIndex].quantity -= 1; // Decrement quantity
        } else {
            // Remove item if quantity is 1
            cart.cartItems.splice(existingItemIndex, 1);
        }
    }

    await cart.save();
    res.status(200).json({ message: 'Item removed from the cart' });
});

const ServiceProviderSchema = new mongoose.Schema({
    name: String,
    service: String,
    price: Number,
    description: String,
    contact: String,
    location: String
  });
  
  const ServiceProvider = mongoose.model('ServiceProvider', ServiceProviderSchema);
  
  // Create a new service provider
  app.post('/api/serviceProviders', async (req, res) => {
    const provider = new ServiceProvider(req.body);
    await provider.save();
    res.send(provider);
  });
  
  // Get all service providers
  app.get('/api/serviceProviders', async (req, res) => {
    const providers = await ServiceProvider.find();
    res.send(providers);
  });
  
  // Get a specific service provider by ID
  app.get('/api/serviceProviders/:id', async (req, res) => {
    const provider = await ServiceProvider.findById(req.params.id);
    res.send(provider);
  });
  
  // Update a service provider
  app.put('/api/serviceProviders/:id', async (req, res) => {
    const provider = await ServiceProvider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(provider);
  });
  
  // Delete a service provider
  app.delete('/api/serviceProviders/:id', async (req, res) => {
    await ServiceProvider.findByIdAndDelete(req.params.id);
    res.send({ message: 'Service Provider deleted' });
  });
  
  /* ------------------------------------
     Event Manager Collection and APIs
  -------------------------------------- */
  
  // Event Manager Schema
  const EventManagerSchema = new mongoose.Schema({
    name: String,
    experience: String,
    specialization: String,
    contact: String,
    location: String,
    rating: String,
    bio: String
  });
  
  const EventManager = mongoose.model('EventManager', EventManagerSchema);
  
  // Create a new event manager
  app.post('/api/eventManagers', async (req, res) => {
    const manager = new EventManager(req.body);
    await manager.save();
    res.send(manager);
  });
  
  // Get all event managers
  app.get('/api/eventManagers', async (req, res) => {
    const managers = await EventManager.find();
    res.send(managers);
  });
  
  // Get a specific event manager by ID
  app.get('/api/eventManagers/:id', async (req, res) => {
    const manager = await EventManager.findById(req.params.id);
    res.send(manager);
  });
  
  // Update an event manager
  app.put('/api/eventManagers/:id', async (req, res) => {
    const manager = await EventManager.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(manager);
  });
  
  // Delete an event manager
  app.delete('/api/eventManagers/:id', async (req, res) => {
    await EventManager.findByIdAndDelete(req.params.id);
    res.send({ message: 'Event Manager deleted' });
  });
  
  /* ------------------------------------
     Static Routes for HTML Pages
  -------------------------------------- */
  
  // Serve index.html on root URL
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'home.html')); // Change to home.html
  });
  
  
  // Serve service_provider.html
  app.get('/service_provider.html', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'service_provider.html'));
  });
  
  // Serve event_manager.html
  app.get('/event_manager.html', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'event_manager.html'));
  });
  
  app.get('/cart', async (req, res) => {
    const cart = await Cart.findOne({ userId: 'user123' });
    res.json(cart ? cart.cartItems : []);
  });
  
  app.delete('/cart/remove/:serviceId', async (req, res) => {
    const { serviceId } = req.params;
  
    // Find the user's cart
    const cart = await Cart.findOne({ userId: 'user123' });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
  
    // Filter out the service from the cart
    cart.cartItems = cart.cartItems.filter(item => item.serviceId !== serviceId);
  
    await cart.save();
    res.status(200).json({ message: 'Item removed' });
  });

// Start the Server
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
