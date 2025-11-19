import Contact from '../models/contactModel.js';

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      userId: req.user?._id || undefined
    });

    return res.status(201).json({ success: true, contactId: contact._id });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};