import React, { FormEvent, useState } from 'react'
import axios from 'axios';
import "@/styles/contactForm/contact.css"

export default function ContactForm() {
  const [ formData, setFormData ] = useState ({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [ isSending, setIsSending] = useState(false)

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [ status, setStatus ] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus('Sending...');

    try {
      const response = await axios.post('http://localhost:8080/api/send-email', formData);
      if (response.status === 200) {
        setStatus('Message sent successfully!');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      }
    }
    catch (error) {
      console.error('Error sending email: ', error);
      setStatus('Failed to send message. Please try again');
    }
    setIsSending(false);
  };

  return (
    <section className='mn-w-wd contact-form' id='contact'>
      <div className='text-center w-full'>
        <strong className='fnt-1'>Connect With Me</strong>
      </div>
      <form className='flex flex-wrap justify-center gap-4 py-6' onSubmit={handleSubmit}>
        <div className='w-1/3 flex flex-col input-text'>
          <label htmlFor='firstName'>First Name:</label>

          <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className='w-1/3 flex flex-col input-text'>
          <label htmlFor='lastName'>Last Name:</label>
          <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className='w-1/3 flex flex-col input-text'>
          <label htmlFor='email'>Email:</label>
          <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required />
        </div>
        <div className='w-full flex flex-col input-text'>
          <label htmlFor='message'>Message:</label>
          <textarea id='message' name='message' value={formData.message} onChange={handleTextAreaChange} rows={6} maxLength={5000} required />
        </div>
        <div>
          <button className='btn v1' type='submit' disabled={isSending}>Send</button>
        </div>
      </form>
      { status && <p>{status}</p> }
    </section>
  )
}
