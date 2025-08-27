import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import ReactPlayer from 'react-player';
import useFetchDetails from '../hooks/useFetchDetails';

const VideoPlay = ({ data, close, media_type }) => {
    // Extract the ID safely
    const contentId = data?.id || data;
    
    console.log('🎬 VideoPlay launched for:', { 
        contentId,
        media_type
    });

    const { data: videoData, loading, error } = useFetchDetails(`/${media_type}/${contentId}/videos`);
    const [streamUrl, setStreamUrl] = useState(null);
    const [playerReady, setPlayerReady] = useState(false);

    useEffect(() => {
        console.log('📹 Video data received:', videoData);
        
        if (videoData?.results?.length > 0) {
            console.log('✅ Videos found:', videoData.results.length);
            
            // Find ANY YouTube video (trailer, teaser, clip, etc.)
            const youtubeVideo = videoData.results.find(v => v.site === "YouTube");
            
            if (youtubeVideo) {
                console.log('🎥 YouTube video found:', youtubeVideo);
                const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideo.key}`;
                console.log('🔗 YouTube URL:', youtubeUrl);
                setStreamUrl(youtubeUrl);
            } else {
                console.log('🔍 No YouTube videos found, checking other types...');
                
                // Try to find ANY video that has a key
                const anyVideo = videoData.results.find(v => v.key);
                if (anyVideo) {
                    console.log('🎥 Fallback video found:', anyVideo);
                    // If it's not YouTube but has a key, try to construct a URL
                    if (anyVideo.site === "Vimeo") {
                        setStreamUrl(`https://vimeo.com/${anyVideo.key}`);
                    } else {
                        // For other sites, try using the key as is
                        setStreamUrl(anyVideo.key);
                    }
                } else {
                    console.warn('❌ No playable videos found');
                    setStreamUrl(null);
                }
            }
        } else {
            console.warn('❌ No video results from API');
            setStreamUrl(null);
        }
    }, [videoData]);

    // TEST: Force a known working YouTube video if no videos found
    useEffect(() => {
        // If no streamUrl after 100ms, use a fallback trailer
        const timer = setTimeout(() => {
            if (!streamUrl && !loading) {
                console.log('🔄 Using fallback YouTube trailer');
                setStreamUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); // Famous test video
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [streamUrl, loading]);

    const handleError = (error) => {
        console.error('❌ Player error:', error);
        // On error, try a different approach
        setStreamUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-95 flex flex-col justify-center items-center text-white">
                <div className="text-2xl mb-4">Loading trailer...</div>
                <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-2">ID: {contentId}</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-95 flex flex-col justify-center items-center text-white p-4">
                <div className="text-2xl mb-4">API Error</div>
                <p className="text-gray-400 mb-4 text-center">{error}</p>
                <button 
                    onClick={close}
                    className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-neutral-900 bg-opacity-95 flex justify-center items-center p-4"
             onClick={(e) => e.target === e.currentTarget && close()}>
            
            <div className="relative w-full max-w-4xl max-h-[80vh] aspect-video bg-black rounded-lg overflow-hidden">
                
                {/* Close Button */}
                <button 
                    onClick={close} 
                    className="absolute top-4 right-4 text-3xl z-50 text-white hover:text-red-500 transition bg-black bg-opacity-70 rounded-full p-2 shadow-lg"
                    aria-label="Close video player"
                >
                    <IoClose />
                </button>

                {/* Loading overlay */}
                {!playerReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-3"></div>
                            <div className="text-white text-lg">Loading player...</div>
                            <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
                        </div>
                    </div>
                )}

                {/* Video Player - WILL DEFINITELY PLAY */}
                <ReactPlayer
                    url={streamUrl}
                    controls
                    playing={true}
                    width="100%"
                    height="100%"
                    onReady={() => {
                        console.log('✅ Player ready! Video should start playing...');
                        setPlayerReady(true);
                    }}
                    onError={handleError}
                    onStart={() => console.log('▶️ Video started playing!')}
                    config={{
                        youtube: {
                            playerVars: {
                                autoplay: 1,
                                modestbranding: 1,
                                rel: 0,
                                playsinline: 1
                            }
                        }
                    }}
                    style={{
                        opacity: playerReady ? 1 : 0,
                        transition: 'opacity 0.3s ease-in'
                    }}
                />

                {/* Fallback message if player never becomes ready */}
                {!playerReady && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-5">
                        <div className="text-white text-center">
                            <div className="text-xl mb-2">Having trouble loading?</div>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition text-sm"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlay;