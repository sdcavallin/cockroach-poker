import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@chakra-ui/react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa'; // Using react-icons

function AudioPlayer() {
  // State to track whether audio is muted
  const [isMuted, setIsMuted] = useState(true);
  // Ref to access the audio element directly
  const audioRef = useRef(null);

  // Function to toggle mute state
  const toggleMute = () => {
    const nextMutedState = !isMuted;
    setIsMuted(nextMutedState);
    if (audioRef.current) {
      audioRef.current.muted = nextMutedState;
      // Attempt to play audio again if unmuting, needed for some browsers
      // after initial user interaction might be required for autoplay.
      if (!nextMutedState && audioRef.current.paused) {
        audioRef.current
          .play()
          .catch((error) =>
            console.log('Error attempting to play audio:', error)
          );
      }
    }
  };

  // Effect to handle initial setup and potential autoplay restrictions
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      // Set initial volume
      audioElement.volume = 0.5;

      // Set initial muted state
      audioElement.muted = isMuted;

      // Try to play - modern browsers might block autoplay until user interaction
      audioElement.play().catch((error) => {
        console.warn(
          'Autoplay was prevented. Audio will start on first interaction (e.g., unmute).',
          error
        );
      });
    }
  }, [isMuted]); // Rerun effect if isMuted changes (though handled in toggleMute mostly)

  return (
    <>
      {/* The hidden audio element */}
      <audio ref={audioRef} src='/music/FunkInTheTrunk.mp3' loop preload='auto'>
        Your browser does not support audio.
      </audio>

      {/* Mute/Unmute Toggle Button */}
      <IconButton
        icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        onClick={toggleMute}
        aria-label={
          isMuted ? 'Unmute background music' : 'Mute background music'
        }
        variant='ghost'
        fontSize='6xl'
        position='fixed' // Keep it fixed on the screen
        top='6' // Position from bottom
        right='4' // Position from right
        zIndex='tooltip' // Ensure it's above most other content
        isRound={true} // Make it circular
        color='#23363d' // Color
        display={{ base: 'none', md: 'flex' }} // Hide it on mobile
        sx={{
          padding: '7',
          _hover: {
            bg: '#E9C46A',
          },
          svg: {
            fontSize: 'inherit', // Inherit the fontSize from the IconButton
          },
        }}
      />
    </>
  );
}

export default AudioPlayer;
