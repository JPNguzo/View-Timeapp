import React, { useRef } from 'react'
import Card from './Card'
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";

const HorizontalScollCard = ({data = [], heading, trending, media_type}) => {
    const containerRef = useRef()

    const handleNext = ()=>{
        containerRef.current.scrollLeft += 300
    }
    const handlePrevious =()=>{
        containerRef.current.scrollLeft += -300
    }
  return (
    <div className='container mx-auto px-3 my-10'>
          <h2 className='text-xl lg:text-2xl font-bold mb-2 text-white capitalize'>{heading}</h2>

          <div className='overflow-hidden relative'>
                <div ref={containerRef} className='grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-6 overflow-x-scroll relative z-10 scroll-smooth transition-all scrolbar-none'>
                {
                    data.map((data,index)=>{
                    return(
                         <Card key={data.id+"heading"+ index} data={data} index={index+1} trending={trending}media_type={media_type}/>
                    )
                    }) 
                }
                </div>

                <div className='absolute top-0 hidden lg:flex justify-between w-full h-full items-center'>
                    <button onClick={handlePrevious}className='bg-white p-1 text-black rounded-full -ml-2 z-10'>
                        <FaAnglesLeft/>
                    </button>
                    <button onClick={handleNext} className='bg-white p-1 text-black rounded-full -mr-2 z-10'>
                        <FaAnglesRight/>
                    </button>
                </div>
           </div>

      </div>



  )
}

export default HorizontalScollCard