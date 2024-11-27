const Address = require('../models/Address');

/**
 * Create new address
 */
const addAddress = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from JWT middleware
    const { recipientName, phoneNumber, address } = req.body;

    if (!recipientName || !phoneNumber || !address) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const newAddress = new Address({ userId, recipientName, phoneNumber, address });
    await newAddress.save();

    res.status(201).json({ message: 'Address created successfully!', address: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error!' });
  }
};

/**
 * Get all addresses of user
 */
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ userId });
    res.status(200).json( addresses );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error!' });
  }
};

/**
 * Delete address by ID
 */
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: 'Address not found!' });
    }

    res.status(200).json({ message: 'Address deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error!' });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  deleteAddress,
};
