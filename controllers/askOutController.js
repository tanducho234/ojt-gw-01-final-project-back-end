const AskOut = require('../models/AskOut');

const getAllAskOuts = async (req, res) => {
  try {
    const askOuts = await AskOut.find();
    res.status(200).json(askOuts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ask-outs' });
  }
};

const getAskOutById = async (req, res) => {
  const { id } = req.params;
  try {
    const askOut = await AskOut.findById(id);
    if (!askOut) return res.status(404).json({ message: 'Ask-out not found' });
    res.status(200).json(askOut);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ask-out' });
  }
};

const createAskOut = async (req, res) => {
  const { question, gifUrl, yesLabel, noLabel, yesTitle, yesSubtext, yesImageUrl, backgroundColor } = req.body;
  try {
    const newAskOut = new AskOut({ question, gifUrl, yesLabel, noLabel, yesTitle, yesSubtext, yesImageUrl, backgroundColor });
    await newAskOut.save();
    res.status(201).json(newAskOut);
  } catch (error) {
    res.status(400).json({ message: 'Error creating ask-out' });
  }
};

const updateAskOut = async (req, res) => {
  const { id } = req.params;
  const { question, gifUrl, yesLabel, noLabel, yesTitle, yesSubtext, yesImageUrl, backgroundColor } = req.body;
  try {
    const updated = await AskOut.findByIdAndUpdate(
      id,
      { question, gifUrl, yesLabel, noLabel, yesTitle, yesSubtext, yesImageUrl, backgroundColor },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Ask-out not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating ask-out' });
  }
};

const deleteAskOut = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await AskOut.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Ask-out not found' });
    res.status(200).json({ message: 'Ask-out deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ask-out' });
  }
};

module.exports = { getAllAskOuts, getAskOutById, createAskOut, updateAskOut, deleteAskOut };
