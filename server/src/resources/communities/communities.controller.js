import Communities from './communities.model';

export const allCommunes = async (req, res) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 470);
  });
  try {
    const communes = await Communities.find({});
    if (!communes) return res.status(400).json({ message: 'Could not get communities.' });

    return res.status(200).json({ communes });
  } catch (err) {
    return res.status(400).end();
  }
};

export const createCommune = async (req, res) => {
  try {
    const commune = await Communities.create(req.body);
    if (!commune) {
      return res.status(400).json({ message: 'Error message' });
    }

    return res.status(200).json(commune);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'There is already a commune with that name.' });
    }
    return res.status(400).json({ message: 'Some other ERROR' });
  }
};

export const oneCommune = async (req, res) => {
  try {
    const { id } = req.params;
    const commune = await Communities.findById(id).lean().exec();

    return res.status(200).json({ data: commune });
  } catch (err) {
    return res.status(500).json({ message: 'Could not get One Commune.' });
  }
};

export const deleteCommune = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCommune = await Communities.findByIdAndRemove(id, { new: true }).lean().exec();

    return res.status(200).json(deletedCommune);
  } catch (err) {
    return res.status(500).json({ message: 'Could not delete One Commune.' });
  }
};

export const getSearch = async (req, res) => {
  try {
    const { name, city } = req.query;
    const searchResults = await Communities.find({ $text: { $search: `${name} ${city}` } })
      .select('-messages -createdAt -updatedAt')
      .exec();
    
    return res.status(200).json(searchResults);
  } catch (err) {
    return res.status(400).json({ message: 'Your search could not be completed. Please try again later.' });
  }
};
