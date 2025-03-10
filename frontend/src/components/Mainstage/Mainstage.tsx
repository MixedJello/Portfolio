import React from 'react'
import "@/styles/mainstage/mainstage.css"
import Draggable from "@/components/Mainstage/Draggable"



export default function Mainstage() {
  return (
    <section className='mainstage mn-w-wd pd_v py-3 relative w-full'>
      <div className='text-center flex flex-col pb-5'>
        <em className='fnt-4'>I am</em>
        <strong className="fnt-big">Tyler McGue</strong>
        <em className='fnt-4'>Drag titles below </em>
      </div>
        <Draggable />
    </section>
  )
}
