import React from 'react'
import '@/styles/contactForm/contact-modal.css'


interface MessageModalProps {
    visible: boolean;
    setVisibility: (x :boolean) => void;
    message: string;
}

export default function MessageStatusModal({ visible, setVisibility, message }: MessageModalProps) {
  return (
    <div  style={{ whiteSpace: 'pre-wrap' }} className={
        visible ? "fixed left-0 top-0 w-full h-full bg-opacity-75 z-50 overflow-auto backdrop-blur flex justify-center items-center"
        : "hidden"
    }>
        <div className='m-auto modal-container'>
            <div className='flex flex-col items-end'>
                <svg className='cursor-pointer' width={35} height={35} onClick={() => setVisibility(!visible)}>
                    <path fill="#00f0ff" d="M10.157 12L0 1.843l1.843-1.843L12 10.157l10.157-10.157l1.843 1.843L13.843 12l10.157 10.157l-1.843 1.843L12 13.843l-10.157 10.157l-1.843-1.843L10.157 12Z"></path>
                </svg>
                <strong className='fnt-1 text-center' dangerouslySetInnerHTML={{ __html: message }}></strong>
            </div>
        </div>

    </div>
  )
}
