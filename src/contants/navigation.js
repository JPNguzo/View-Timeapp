import { MdHomeFilled } from 'react-icons/md';
import { PiTelevisionSimpleFill } from "react-icons/pi";
import { RiMovieLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";


export const navigation = [
        { 
            label: 'TV Shows', 
            href: 'tv',
            icon: <PiTelevisionSimpleFill/>
        },
        { 
            label: 'Movies', 
            href: 'movie',
            icon: <RiMovieLine/>
        },
    ]

export const mobileNavigation = [
    {
        label : "Home",
        href : "/",
        icon : <MdHomeFilled/>
    },
    ...navigation,
    {
        label : "search",
        href : "/search",
        icon : <IoSearchOutline/>
    }
]
