import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import './Contact.css';

const Contact = () => {
  const { backendUrl, isLoggedIn, user } = useContext(AppContext);
  const [form, setForm] = useState({
    name: isLoggedIn ? (user?.name || '') : '',
    email: isLoggedIn ? (user?.email || '') : '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email.';
    if (!form.subject.trim()) return 'Please enter a subject.';
    if (!form.message.trim() || form.message.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setStatus({ loading: false, error: err, success: '' });
    setStatus({ loading: true, error: '', success: '' });
    try {
      const { data } = await axios.post(`${backendUrl}/api/contact`, form, { withCredentials: true });
      if (data?.success) {
        setForm({ name: isLoggedIn ? (user?.name || '') : '', email: isLoggedIn ? (user?.email || '') : '', subject: '', message: '' });
        setStatus({ loading: false, error: '', success: 'Message sent. We will contact you soon.' });
      } else {
        setStatus({ loading: false, error: data?.message || 'Failed to send message', success: '' });
      }
    } catch (err) {
      setStatus({ loading: false, error: err?.response?.data?.message || 'Network error', success: '' });
    }
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p className="contact-sub">Have questions or feedback about recipes? Send us a message.</p>

      <form className="contact-form" onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} placeholder="Your name" />
        </label>

        <label>
          Email
          <input name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
        </label>

        <label>
          Subject
          <input name="subject" value={form.subject} onChange={onChange} placeholder="Subject" />
        </label>

        <label>
          Message
          <textarea name="message" value={form.message} onChange={onChange} placeholder="Your message..." rows="6" />
        </label>

        <div className="contact-actions">
          <button type="submit" disabled={status.loading}>{status.loading ? 'Sending...' : 'Send Message'}</button>
        </div>

        {status.error && <div className="contact-error">{status.error}</div>}
        {status.success && <div className="contact-success">{status.success}</div>}
      </form>
    </div>
  );
};

export default Contact;