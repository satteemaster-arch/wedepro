const fs = require('fs').promises;
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '..', 'orders.json');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CARD_REGEX = /^\d{16}$/;

function validate(cart, email, cardNumber) {
  const errors = {};

  if (!Array.isArray(cart) || cart.length === 0) {
    errors.cart = 'Cart must be a non-empty array of items.';
  } else {
    const invalidItem = cart.find(
      (item) =>
        !item.id ||
        typeof item.name !== 'string' ||
        typeof item.price !== 'number' ||
        typeof item.quantity !== 'number' ||
        item.quantity < 1
    );
    if (invalidItem) {
      errors.cart = 'Each cart item must have a valid id, name, price, and quantity.';
    }
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  const digits = typeof cardNumber === 'string' ? cardNumber.replace(/\s/g, '') : '';
  if (!CARD_REGEX.test(digits)) {
    errors.cardNumber = 'Credit card number must be exactly 16 digits.';
  }

  return errors;
}

async function saveOrder(order) {
  let orders = [];
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf8');
    orders = JSON.parse(raw);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  orders.push(order);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

async function checkout(req, res) {
  const { cart, email, cardNumber } = req.body;

  const errors = validate(cart, email, cardNumber);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, clearCart: false, errors });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    id: `order_${Date.now()}`,
    email: email.trim().toLowerCase(),
    cart,
    total: Math.round(total * 100) / 100,
    placedAt: new Date().toISOString(),
  };

  try {
    await saveOrder(order);
  } catch (err) {
    console.error('Save order failed:', err);
    return res.status(400).json({
      success: false,
      clearCart: false,
      errors: {
        order: 'Your order could not be saved. Please try again.',
      },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully.',
    orderId: order.id,
    total: order.total,
  });
}

module.exports = { checkout };
