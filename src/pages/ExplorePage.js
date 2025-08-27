import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'

const ExplorePage = () => {
  const params = useParams()
  const [pageNo, setPageNo] = useState(1)
  const [data,setData] = useState([])
  const [totalPageNo, setTotalPageNo] = useState(0)

  const mapExploreParam = (param) => {
  if (param === 'tv-shows') return 'tv'
  if (param === 'movies') return 'movie'
  return param
}


  console.log("paramas",params.explore)

  const fetchData = async()=>{
    try {
      const tmdbType = mapExploreParam(params.explore)
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/${tmdbType}`,
        {
          params : {
            page: pageNo,
            api_key: 'e493e62afadc92e18b6a8f80ba4f64e1'
          }
        }
      )
      setData((preve)=>{
        return[
           ...preve,
           ...response.data.results
        ]
      })

      setTotalPageNo(response.data.total_pages)
      
    } catch (error) {
        console.log('error',error.response?.data || error.message)
      
    }
  }

  const handleScroll = ()=>{
    if((window.innerHeight + window.scrollY ) >= document.body.offsetHeight){
      setPageNo(preve => preve + 1)
    }
  }

  useEffect(()=>{
     fetchData()
  },[pageNo])

  useEffect(()=>{
    setPageNo(1)
    setData([])
    fetchData()

  },[params.explore])

  useEffect(()=>{
    window.addEventListener('scroll',handleScroll)
  },[])


  
  return (
    <div className='py-16'>
      <div className='container mx-auto'>
        <h3 className='capitalize text-lg lg:text-xl font-semibold my-3'>Popular {params.explore}</h3>

        <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center'>
          {
            data.map((exploreData,index)=>{
              return(
                <Card
                   data={exploreData}
                   key={`${exploreData.id}-${index}-${params.explore}-exploreSection`}
                   media_type= {params.explore}
                />

              )
            })
          }
        </div>

      </div>

    </div>
  )
}

export default ExplorePage
