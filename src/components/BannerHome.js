import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const BannerHome = () => {
  const bannerData = useSelector(state => state.viewtimeData.bannerData)
  const imageURL = useSelector(state => state.viewtimeData.imageURL)
  const [currentImage, setCurrentImage] = useState(0)

  const handleNext = () => {
    if( currentImage < bannerData.length - 1){
      setCurrentImage(preve => preve + 1)
    }
  }
    

  const handlePrevious = () => {
     if( currentImage > 0){
      setCurrentImage(preve => preve - 1)
    }
  }

  useEffect(() =>{
      const interval = setInterval(()=>{
       if(currentImage < bannerData.length - 1){
          handleNext()
        }else{
          setCurrentImage(0)
        }
      }, 5000)
        
      return () => clearInterval(interval)
  }, [bannerData, imageURL, currentImage])

    console.log("banner Home",bannerData)
  return (
    <section className = 'w-full h-full'>
      <div className='flex min-h-full max-h-[95vh] overflow-hidden'>
        {
            bannerData.map((data, index)=>{
              
                return(
                    <div key={data.id+"bannerHome"+index} className='min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all' style={{ transform : `translateX(-${currentImage * 100}%)`}}>
                            <div className='w-full h-full'>
                                <img
                                    src={imageURL+data.backdrop_path}
                                    className='h-full w-full object-cover'
                                />
                            </div>

                            {/***button next and previous image */}
                            <div className='absolute top-0 w-full h-full hidden items-center justify-between group-hover:lg:flex'>
                              <button onClick={handlePrevious} className='bg-white p-1 rounded-full text-2xl z-10 text-black'>
                                <FaAnglesLeft/>
                              </button>
                              <button onClick={handleNext} className='bg-white p-1 rounded-full text-2xl z-10 text-black'>
                                <FaAnglesRight/>
                              </button>
                            </div>


                            <div className='absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent'>
                            </div>

                            <div className='container mx-auto'>
                                <div className='container mx-auto w-full absolute bottom-0 max-w-md px-3'>
                                     <h2 className='font-bold text-2xl lg:text-4xl text-white drop-shadow-2xl'>{data?.title || data?.name}</h2>
                                     <p className='text-ellipsis line-clamp-3 my-2'>{data.overview}</p>
                                     <div className='flex items-center gap-4'>
                                         <p>Rating : {Number(data.vote_average).toFixed(1)} + </p>
                                         <span>|</span>
                                         <p>View : {Number(data.popularity).toFixed(0)}</p>
                                     </div>
                                     
                                     <Link to={"/"+data?.media_type+"/"+data.id}>
                                      <button  className='block bg-white px-4 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-red-200 to-orange-500 shadow-md transition-a11 hover:scale-105'>
                                         Play Now
                                     </button>
                                     </Link>
                                </div>
                            </div>

                            
                    </div>
                )
            })
        }
     </div>  
    </section>
  )
}

export default BannerHome
