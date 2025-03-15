import React from 'react'


interface MessageModalProps {
    visible: boolean;
    setVisibility: (x :boolean) => void;
    message: string;
}

export default function MessageStatusModal({ visible, setVisibility, message }: MessageModalProps) {
  return (
    <div className={
        visible ? "fixed left-0 top-0 w-full h-full bg-opacity-75 z-50 overflow-auto backdrop-blur flex justify-center items-center"
        : "hidden"
    }>
        <div className='m-auto'>
            <div className='flex flex-col items-end'>
                <svg className='cursor-pointer' width={32} height={32} onClick={() => setVisibility(!visible)}>
                    <path fill="#00f0ff" d="M10.586 12 2.793 4.207l1.414-1.414L12 10.586l7.793-7.793 1.414 1.414L13.414 12l7.793 7.793-1.414 1.414L12 13.414l-7.793 7.793-1.414-1.414L10.586 12Z"></path>
                </svg>
                <strong className='fnt-1 text-center'>{message}</strong>
            </div>
        </div>

    </div>
  )
}
