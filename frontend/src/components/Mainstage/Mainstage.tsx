import React from 'react'
import "@/styles/mainstage/mainstage.css"
import AnimatedCircle from './AnimatedCircle'
// import Typewriter from './Typewriter'


export default function Mainstage() {
  return (
    <section className='mainstage mn-w-wd relative w-full'>
      <div className=''>
        <div className='inf relative flex justify-between align-center'>
          <div className='w-full flex flex-col items-center xl:items-start px-3 py-3'>
            <em className="fnt-3 pb-5">Hello World! I am</em>
              <strong className="fnt-big pb-5">Tyler McGue</strong>
              {/* <Typewriter /> */}
          </div>
          <div className='w-full flex justify-center'>
            <AnimatedCircle />
          </div>
        </div>
      </div>
    </section>
  )
}
