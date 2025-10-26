


// Global variables
const artists = ['jubin garg','shreya ghoshal','Diljit Dosanjh','Satinder Sartaaj','arijit singh','shiva  choudhari', 'jubin nautiyal'];
let songs = [];
let currentSongIndex = 0;


  if (localStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "login.html";
    }



 function logout() {
    // Remove login state
    localStorage.removeItem("isLoggedIn");
   
    window.location.href = "login.html";
  }


// Get DOM elements
const songsContainer = document.getElementById('songsContainer');
const nowPlayingTitle = document.querySelector('h2.text-3xl.font-bold');
const nowPlayingArtist = document.querySelector('p.text-gray-400.mt-1');
const nowPlayingAlbum = document.querySelector('.flex.items-center.justify-center.md\\:justify-start.gap-4.mt-4 span:nth-child(1)');
const nowPlayingYear = document.querySelector('.flex.items-center.justify-center.md\\:justify-start.gap-4.mt-4 span:nth-child(3)');
const discDiv = document.querySelector('.disc');
const audio = document.getElementById('audioPlayer');
const progressContainer = document.querySelector('.progress-container');
const progressBar = progressContainer.querySelector('.bg-indigo-500');
const currentTimeEl = progressContainer.querySelector('div.flex > span:first-child');
const durationEl = progressContainer.querySelector('div.flex > span:last-child');
const nextBtn = document.getElementById('forwardBtn');
const prevBtn = document.getElementById('prevBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = playPauseBtn.querySelector('svg');
const volumeSlider = document.querySelector('.volume-slider');

// Format time
function formatTime(ms) {
  if (!ms) return '--:--';
  const totalSeconds = Math.floor(ms / 1000);
  const min = Math.floor(totalSeconds / 60);
  const sec = (totalSeconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

Promise.all(
    artists.map(artist =>
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&media=music&limit=2000`)
        .then(res => res.json())
        .then(data => {
          console.log(data.results); 
          return data.results;
        })
    )
  )
  .then(allResults => {
    songs = allResults.flat();
    console.log("All combined songs:", songs); // log all combined results
  
    renderSongs();
  
    if (songs.length > 0) {
      playSelectedSong(songs[0], 0);
      highlightActiveSong(0);
    }
  });
  

// Render playlist
function renderSongs() {
  songsContainer.innerHTML = '';

  songs.forEach((song, index) => {
    const div = document.createElement('div');
    div.className = 'playlist-item flex items-center gap-3 p-3 rounded-lg cursor-pointer transition';

    div.innerHTML = `
  <img src="${song.artworkUrl60 || song.artworkUrl100}" alt="Album cover" class="w-12 h-12 rounded" />
  <div class="flex-1 min-w-0">
    <h4 class="font-medium truncate">${song.trackName}</h4>
    <p class="text-sm text-gray-400 truncate">${song.artistName} • ${song.collectionName}</p>
  </div>
  <a href="${song.previewUrl}" download class="text-indigo-400 text-sm hover:underline">
   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
    </svg>
  </a>
  <span class="text-sm text-gray-400">${formatTime(song.trackTimeMillis)}</span>
`;

    div.addEventListener('click', () => {
      playSelectedSong(song, index);
      highlightActiveSong(index);
    });

    songsContainer.appendChild(div);
  });
}

// Play selected song
function playSelectedSong(song, index) {
  currentSongIndex = index;
  updateNowPlaying(song);
  highlightActiveSong(index);
}

// Update UI and play song
function updateNowPlaying(song) {
  nowPlayingTitle.textContent = song.trackName || 'Unknown Title';
  nowPlayingArtist.textContent = song.artistName || 'Unknown Artist';
  nowPlayingAlbum.textContent = `Album: ${song.collectionName || 'N/A'}`;
  nowPlayingYear.textContent = song.releaseDate ? song.releaseDate.slice(0, 4) : 'N/A';

  discDiv.style.backgroundImage = `url(${song.artworkUrl100 || song.artworkUrl60})`;
  discDiv.style.backgroundSize = 'cover';
  discDiv.style.backgroundPosition = 'center';

  if (song.previewUrl) {
    audio.src = song.previewUrl;
    audio.play();
    showPauseIcon();
  } else {
    audio.pause();
    audio.src = '';
    showPlayIcon();
  }

  audio.onloadedmetadata = () => {
    durationEl.textContent = formatTime(audio.duration * 1000);
  };
}

// Play/pause toggle
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    showPauseIcon();
  } else {
    audio.pause();
    showPlayIcon();
  }
});

// Play/pause icon switch
function showPauseIcon() {
  playPauseIcon.innerHTML = `
    <path id="primary" d="M7,3H9a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V4A1,1,0,0,1,7,3Zm8,18h2a1,1,0,0,0,1-1V4a1,1,0,0,0-1-1H15a1,1,0,0,0-1,1V20A1,1,0,0,0,15,21Z" style="fill: none; stroke: black; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path>
  `;
}

function showPlayIcon() {
  playPauseIcon.innerHTML = `
    <path id="primary" d="M6,4l14,8L6,20Z" style="fill: none; stroke: black; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path>
  `;
}

// Next button
nextBtn.addEventListener('click', () => {
  if (currentSongIndex < songs.length - 1) {
    currentSongIndex++;
    playSelectedSong(songs[currentSongIndex], currentSongIndex);
  }
});

// Previous button
prevBtn.addEventListener('click', () => {
  if (currentSongIndex > 0) {
    currentSongIndex--;
    playSelectedSong(songs[currentSongIndex], currentSongIndex);
  }
});

// Highlight active song
function highlightActiveSong(index) {
  const playlistItems = document.querySelectorAll('.playlist-item');
  playlistItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      item.classList.remove('active');
    }
  });
}

// Volume control
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value / 100;
});





// Progress bar update
audio.ontimeupdate = () => {
  const current = audio.currentTime;
  const duration = audio.duration;
  if (duration) {
    const percent = (current / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(current * 1000);
  }
};

// Autoplay next song
audio.addEventListener('ended', () => {
  if (currentSongIndex < songs.length - 1) {
    currentSongIndex++;
    playSelectedSong(songs[currentSongIndex], currentSongIndex);
  } else {
    audio.pause();
    showPlayIcon();
  }
});

// wave animation 
const waveContainer = document.getElementById('waveAnimation');
waveContainer.innerHTML = '';

const spanCount = 87;
const delayStep = 0.2; // seconds

for (let i = 0; i < spanCount; i++) {
  const span = document.createElement('span');
  span.style.animationDelay = `-${i * delayStep}s`;
  waveContainer.appendChild(span);
}



audio.addEventListener('play', () => {
    document.getElementById('waveAnimation').style.display = 'flex';
  });
  
  audio.addEventListener('pause', () => {
    document.getElementById('waveAnimation').style.display = 'none';
  });
  
  audio.addEventListener('ended', () => {
    document.getElementById('waveAnimation').style.display = 'none';
  });
  
  

  audio.addEventListener('play', () => {
    document.getElementById('waveAnimation').style.display = 'flex';
  });
  
  audio.addEventListener('pause', () => {
    document.getElementById('waveAnimation').style.display = 'none';
  });

//   playlist section

const playlistPanel = document.getElementById('playlistPanel');
  const playlistToggleBtn = document.getElementById('playlistToggleBtn');
  const closePlaylist = document.getElementById('closePlaylist');

  playlistToggleBtn?.addEventListener('click', () => {
    playlistPanel.classList.remove('translate-x-full');
  });

  closePlaylist?.addEventListener('click', () => {
    playlistPanel.classList.add('translate-x-full');
  });




  


  
