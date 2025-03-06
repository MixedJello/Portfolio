import React from 'react'
import Grid from './Grid'
import "@/styles/mainstage/mainstage.css"


export default function Mainstage() {
  return (
    <section className='mainstage mn-w-wd relative w-full'>
      <Grid />
      <div className='flex justify-between'>
        <div className='inf w-1/2 xl:w-1/3 relative'>
          <div className='flex flex-col items-center xl:items-start px-3 py-3'>
            <em className="fnt-3 pb-5">Hello World! I am</em>
              <strong className="fnt-big pb-5">Tyler McGue</strong>
              <em className="fnt-3">TypeWriter</em>
          </div>
        </div>
        <div>
          PICTURE
        </div>
      </div>
    </section>
  )
}
