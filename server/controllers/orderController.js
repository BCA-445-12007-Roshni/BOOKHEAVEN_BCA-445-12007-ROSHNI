import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import stripe from "stripe";

//Global variable for payment
const currency = "inr";
const deliveryCharges = 50; //50 rupees
const taxPercentage = 0.02; //2% tax charge

//PLACE ORDER USING COD
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (items.length === 0) {
      return res.json({ success: false, message: "Cart empty" });
    }

    let subtotal = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      subtotal += product.offerPrice * item.quantity;
    }

    const taxAmount = subtotal * taxPercentage;
    const totalAmount = subtotal + taxAmount + deliveryCharges;

    await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      paymentMethod: "COD",
    });

    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//PLACE ORDER USING STRIPE
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    if (items.length === 0) {
      return res.json({ success: false, message: "Please add product first" });
    }

    let productData = [];
    let subtotal = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });

      subtotal += product.offerPrice * item.quantity;
    }

    //calculate total amount by adding tax and delivery charges
    const taxAmount = subtotal * taxPercentage;
    const totalAmount = subtotal + taxAmount + deliveryCharges;

    const order = await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      paymentMethod: "stripe",
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    //Create line items for stripe
    let line_items = productData.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: { name: item.name },
          unit_amount: Math.floor(item.price * 100), //multiply by 94 for getting into rupees
        },
        quantity: item.quantity,
      };
    });

    //Add tax as separate line item
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Tax (2%)" },
        unit_amount: Math.floor(taxAmount * 100),
      },
      quantity: 1,
    });

    //Add Delivery Charges as separate line item
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.floor(deliveryCharges * 100),
      },
      quantity: 1,
    });

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// STRIPE WEBHOOKS FOR VERIFYING PAYMENT THROUGH STRIP
export const stripeWebhooks = async (request, response) => {
  //Stripe gateway initialization
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const signature = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    response.status(400).send(`Webhook Error: $(error.message)`);
  }

  //Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //Getting session Metadata
      const session = await stripeInstance.checkout.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;
      //Make Order as paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      //Clear User Cart
      await User.findByIdAndUpdate(userId, { cartData: {} });
      break;
    }
    case "payment_intent.failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //Getting session Metadata
      const session = await stripeInstance.checkout.session.list({
        payment_intent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;
      //Delete the order if payment is failed
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.log(`unhandled event type ${event.type}`);
      break;
  }

  response.json({ received: true });
};

//ALL ORDERS DATA FOR FRONTEND BY USERID
export const userOrders = async (req, res) => {
  try {

    const userId = req.userId

    const orders = await Order.find({
      userId,
      $or: [{ paymentMethod: "COD" }, { isPaid: true }],
    })
    .populate("items.product address")
    .sort({ createdAt: -1 })

    res.json({ success: true, orders })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}


//ALL ORDERS DATA FOR ADMIN PANEL
export const allOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      $or: [{ paymentMethod: "COD" }, { isPaid: true }],
    })
    .populate("items.product address")
    .sort({ createdAt: -1 })

    res.json({ success: true, orders })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}


//UPDATING ORDER STATUS FROM ADMIN PANEL
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
