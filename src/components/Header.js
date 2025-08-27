import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png' // Assuming you have a logo image
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import userIcon from '../assets//user.png' // Assuming you have a user icon
import { IoSearchOutline } from "react-icons/io5";

const navigation = [
    
    { label: "TV Shows", href: "/tv-shows" },
    { label: "Movies", href: "/movies" },
];

const Header = () => {
    const location = useLocation()
    const removeSpace = location?.search?.slice(3).split("%20")?.join(" ")
    
    const [searchInput,setSearchInput] = useState(removeSpace)
    const navigate = useNavigate()
    
    console.log("location",) 

    useEffect(() => {
        if(searchInput){
              navigate(`/search?q=${searchInput}`)
        }
        
    },[searchInput,])

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <header className="fixed top-0 w-full h-16 bg-black bg-opacity-75 z-40">
            <div className='container mx-auto px-2 flex items-center h-full'>
                {/* Logo */}
                <Link to = {"/"}>
                    <img
                    src={logo}
                    alt='logo'
                    width={200}
                    
                    />
                </Link>
                
                {/* Navigation */}
                <nav className='hidden lg:flex items-center gap-6'>
                    {navigation.map((nav, index) => (
                        <NavLink key={nav.label} to={nav.href} className="text-white font-semibold hover:text-neutral-300">
                            {nav.label}
                        </NavLink>
                    ))}
                </nav>
            

                <div className='ml-auto flex items-center gap-5'>
                    <form className='flex items-center gap-2' onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='Search here...'
                            className='bg-transparent px-4 py-1 outline-none border-none hidden lg:block'
                            onChange={(e)=>setSearchInput(e.target.value)} 
                            value={searchInput}
                        />
                        <button className='text-2xl text-white'>
                            <IoSearchOutline/>
                        </button>
                    </form>
                    <div className='w-10 h-10 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all'>
                        <img
                            src={userIcon}
                            width='w-full h-full'
                            alt="User Icon"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
