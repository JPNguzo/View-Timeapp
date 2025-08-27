import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import useFetchDetails from '../hooks/useFetchDetails'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Divider from '../components/Divider'
import useFetch from '../hooks/useFetch'
import HorizontalScollCard from '../components/HorizontalScollCard'
import VideoPlay from '../components/VideoPlay'

const DetailsPage = () => {
  const params = useParams()
  const imageURL = useSelector(state => state.viewtimeData.imageURL)

  
  const { data } = useFetchDetails(`/${params?.explore}/${params?.id}`)
  const { data : castData } = useFetchDetails(`/${params?.explore}/${params?.id}/credits`)

  const { data : similarData } = useFetch(`/${params?.explore}/${params?.id}/similar`)
  const { data : recommendationsData } = useFetch(`/${params?.explore}/${params?.id}/recommendations`)
  const [playVideo, setPlayVideo] = useState(false)

  console.log("📊 Main data:", data)
  console.log("🎭 Cast data:", castData)

  const handlePlayVideo = () => {
    console.log('🎯 Play button clicked for ID:', params?.id)
    setPlayVideo(true)
  }

  const duration = data?.runtime ? (Number(data.runtime)/60).toFixed(1).split(".") : ['0', '0']
  
  const writers = castData?.crew
    ?.filter(member => 
      ["writer", "screenplay", "screen story"].some(role => 
        member?.job?.toLowerCase().includes(role)
      )
    )
    ?.map(member => member?.name)
    ?.filter((name, index, array) => array.indexOf(name) === index) // Remove duplicates
    ?.join(", ") || "Not available" 

  console.log("✍️ Filtered writers:", writers)

  
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
        
        {/* Backdrop Image */}
        <div className='w-full h-[280px] relative hidden lg:block'>
          <div className='w-full h-full'>
             <img
               src={imageURL + data?.backdrop_path}
               className='w-full h-full object-cover'
               alt={data?.title || data?.name}
             />
          </div>
          <div className='absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900/90 to-transparent'></div>
        </div>

        {/* Main Content */}
        <div className='container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10'>
          
          {/* Poster and Play Button */}
          <div className='relative mx-auto lg:-mt-28 lg:ml-0 w-fit min-w-60'>
            <img
              src={imageURL + data?.poster_path}
              className='h-80 w-60 object-cover rounded'
              alt={data?.title || data?.name}
            />
            
            {/* Play Button */}
            <button 
              onClick={handlePlayVideo}
              className='mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-l from-red-500 to-orange-500 hover:scale-105 transition duration-300'
            >
              Play Now
            </button>
          </div>

          {/* Movie Details */}
          <div className='flex-1'>

            {/* Title */}
            <h2 className='text-2xl lg:text-4xl font-bold text-white'>{data?.title || data?.name}</h2>
            <p className='text-neutral-400'>{data?.tagline}</p>

            <Divider/>
            
            {/* Ratings and Info */}
            <div className='flex items-center gap-3 flex-wrap'>
              <p>Rating: {Number(data?.vote_average)?.toFixed(1) || 'N/A'}+</p>
              <span>•</span>
              <p>Views: {Number(data?.vote_count)?.toLocaleString() || '0'}</p>
              <span>•</span>
              <p>Duration: {duration[0]}h {duration[1]}m</p>
            </div>

            <Divider/>

            {/* Overview */}
            <div>
              <h3 className='text-xl font-bold text-white'>Overview</h3>
              <p className='text-neutral-300'>{data?.overview || 'No overview available.'}</p>

              <Divider/>

              {/* Additional Info */}
              <div className='flex items-center gap-3 my-3 flex-wrap'>
                 <p>Status: {data?.status || 'Unknown'}</p>
                 <span>•</span>
                 <p>Release Date: {data?.release_date ? moment(data.release_date).format("MMMM DD, YYYY") : 'Unknown'}</p>
                 <span>•</span>
                 <p>Revenue: ${Number(data?.revenue)?.toLocaleString() || '0'}</p>
              </div>

              <Divider/>
            </div>

            {/* Crew */}
            <div>
              <p> 
                <span className='text-white font-semibold'>Director:</span> 
                {castData?.crew?.find(person => person.job === "Director")?.name || " Unknown"}
              </p> 

              <Divider/>

              <p>
                <span className="text-white font-semibold">Writers:</span> 
                {writers}
              </p>
            </div>

            <Divider/> 

            {/* Cast */}
            <h2 className='font-bold text-lg mb-4'>Cast</h2>      
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {castData?.cast?.filter(el => el.profile_path).slice(0, 10).map((starCast, index) => (
                <div key={index} className='text-center flex flex-col items-center gap-2'>
                  <div>
                    <img
                      src={imageURL + starCast?.profile_path}
                      className='w-24 h-24 object-cover rounded-full'
                      alt={starCast?.name}
                    />
                  </div>
                  <p className='font-bold text-sm text-neutral-400 text-center'>{starCast?.name}</p>
                  <p className='text-xs text-neutral-500'>{starCast?.character}</p>
                </div>
              ))}
            </div> 

          </div>
        </div>

        {/* Similar and Recommendations */}
        <div className='container mx-auto px-3 py-8'>
          {similarData?.results?.length > 0 && (
            <HorizontalScollCard 
              data={similarData} 
              heading={"Similar " + params?.explore} 
              media_type={params?.explore}
            />
          )}
          
          {recommendationsData?.results?.length > 0 && (
            <HorizontalScollCard 
              data={recommendationsData} 
              heading={"Recommendations"} 
              media_type={params?.explore}
            />
          )}
        </div>

        {/* Video Player Modal */}
        {playVideo && (
          <VideoPlay 
            data={params?.id} 
            close={() => {
              console.log('🎬 Closing video player');
              setPlayVideo(false);
            }} 
            media_type={params?.explore}
          />
        )}
    </div>
  )
}

export default DetailsPage