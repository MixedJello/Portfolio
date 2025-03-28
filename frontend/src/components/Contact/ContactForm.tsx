'use client'
import React, { FormEvent, useEffect, useState } from 'react'
import axios from 'axios';
import "@/styles/contactForm/contact.css"
import MessageStatusModal from './MessageStatusModal';

export default function ContactForm() {
  //Form State Management
  const [ formData, setFormData ] = useState ({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  //Status State Management
  const [ isSending, setIsSending] = useState(false)
  const [ status, setStatus ] = useState('');
  const [ isMounted, setIsMounted ] = useState(false);

  //Modal State Management
  const [ modal, setModal ] = useState(true);

  //Ensure component only renders on client after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      const response = await axios.post('/api/send-email', formData);
      if (response.status === 200) {
        setStatus(`Message sent!<br/><span class="fnt-2">I will get back to you at my earliest availability.</span> `);
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      }
    }
    catch (error) {
      console.error('Error sending email: ', error);
      setStatus(`Failed to send message. You can also email me directly here <a href="mailto:tylermcgue@gmail.com">tylermcgue@gmail.com</a>`);
    }
    setIsSending(false);
  };

  // Prevent rendering until client-side mount to avoid hydration issues
  if (!isMounted) {
    return null; 
  }

  return (
    <section className='mn-w-wd contact-form' id='contact'>
      <div className='text-center w-full'>
        <strong className='fnt-1'>Connect With Me</strong>
      </div>
      <form className='flex flex-wrap justify-center gap-4 py-6' onSubmit={handleSubmit}>
        <div className='w-full lg:w-1/3 flex flex-col input-text'>
          <label htmlFor='firstName'>First Name:</label>

          <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className='w-full lg:w-1/3 flex flex-col input-text'>
          <label htmlFor='lastName'>Last Name:</label>
          <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className='w-full lg:w-1/3 flex flex-col input-text'>
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
      { status && <MessageStatusModal visible={modal} setVisibility={setModal} message={status} /> }
    </section>
  )
}
