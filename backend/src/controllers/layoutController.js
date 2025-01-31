import Layout from "../models/Layout.js";

// Fetch all layouts
export const getLayouts = async (req, res) => {
  try {
    const layouts = await Layout.find();
    res.status(200).json(layouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save a new layout
export const saveLayout = async (req, res) => {
  const { name, objects } = req.body;

  try {
    const layout = new Layout({ name, objects });
    const savedLayout = await layout.save();
    res.status(201).json(savedLayout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a layout
export const deleteLayout = async (req, res) => {
  try {
    const { id } = req.params;
    await Layout.findByIdAndDelete(id);
    res.status(200).json({ message: "Layout deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};