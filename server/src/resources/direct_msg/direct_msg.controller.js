import DirectMsg from './direct_msg.model';

export const allDmMsgs = async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const dmMsgs = await DirectMsg.findOne({ dm_users: { $all: [user1, user2] } }).lean().exec();
    if (!dmMsgs) return res.status(400).json({ message: 'Could not get messages for DM users.' });
    return res.status(200).json({ data: dmMsgs });
  } catch (err) {
    return res.status(400).json({ message: 'Error getting Dm messages.' });
  }
};

export const unseenMsgs = async (req, res) => {
  try {
    const unseenDocs = await DirectMsg.find({}, { 'messages.$[].wasSeen': false }).lean().exec();
    if (!unseenDocs) return res.status(400).json({ message: 'Could not get unseen messages.' });
    return res.status(200).json({ data: unseenDocs });
  } catch (err) {
    return res.status(400).json({ message: 'Error getting unseen messages.' });
  }
};
