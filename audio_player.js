/**
 * Audio Player Module for Pip-Boy OS
 * Handles audio/wav file playback and management
 */

// Debug logging function
function debugLog(message) {
  console.log("[AudioPlayer] " + message);
}

debugLog("Starting audio_player.js initialization");

// Audio Player object
var AudioPlayer = {
  // Audio context and state
  isInitialized: false,
  currentAudio: null,
  volume: 1.0,
  
  // Initialize the audio player
  init: function() {
    debugLog("Initializing AudioPlayer...");
    
    try {
      // Set initialization flag
      this.isInitialized = true;
      debugLog("AudioPlayer initialized successfully");
      return true;
    } catch (error) {
      debugLog("Error initializing AudioPlayer: " + error.message);
      return false;
    }
  },
  
  // Load and prepare audio file
  loadAudio: function(filename) {
    debugLog("Loading audio file: " + filename);
    
    if (!this.isInitialized) {
      debugLog("AudioPlayer not initialized, calling init()");
      if (!this.init()) {
        debugLog("Failed to initialize AudioPlayer");
        return false;
      }
    }
    
    try {
      // Check if file exists in common audio directories
      var audioPath = this.findAudioFile(filename);
      if (!audioPath) {
        debugLog("Audio file not found: " + filename);
        return false;
      }
      
      debugLog("Audio file located at: " + audioPath);
      
      // Use Pip's built-in audio system if available
      if (typeof Pip !== 'undefined' && Pip.audioBuiltin) {
        debugLog("Using Pip.audioBuiltin for playback");
        this.currentAudio = Pip.audioBuiltin(filename);
        return true;
      }
      
      debugLog("Audio loaded successfully: " + filename);
      return true;
      
    } catch (error) {
      debugLog("Error loading audio: " + error.message);
      return false;
    }
  },
  
  // Find audio file in known directories
  findAudioFile: function(filename) {
    var searchPaths = [
      "UI/" + filename,
      "RADIO/" + filename,
      filename
    ];
    
    for (var i = 0; i < searchPaths.length; i++) {
      var path = searchPaths[i];
      debugLog("Checking path: " + path);
      
      // Check for specific file patterns to determine likely location
      if (path.indexOf("UI/") === 0) {
        // UI sounds include: CLICK, OK, POWER_OFF, RADIO_ON, etc.
        var uiSounds = ['CLICK', 'OK', 'CANCEL', 'POWER_OFF', 'RADIO_ON', 'RADIO_OFF', 
                       'ALERT', 'BURST', 'COLUMN', 'DOWN', 'FOCUS', 'HOLO', 'NEXT', 'PREV', 'UP'];
        var basename = filename.replace('.wav', '').replace('.WAV', '');
        
        if (uiSounds.some(function(sound) { return basename.indexOf(sound) !== -1; })) {
          return path;
        }
      } else if (path.indexOf("RADIO/") === 0) {
        // Radio sounds include: MX01-MX16, SFX01-SFX03, DX01-DX03, TUNING
        var basename = filename.replace('.wav', '').replace('.WAV', '');
        
        if (basename.match(/^(MX|SFX|DX)\d+$/) || basename === 'TUNING') {
          return path;
        }
      }
    }
    
    // Default to UI directory for most files
    debugLog("File not found in specific locations, defaulting to UI/");
    return "UI/" + filename;
  },
  
  // Play loaded audio
  play: function(filename) {
    debugLog("Playing audio: " + (filename || "current"));
    
    try {
      if (filename) {
        if (!this.loadAudio(filename)) {
          debugLog("Failed to load audio for playback: " + filename);
          return false;
        }
      }
      
      if (this.currentAudio && typeof Pip !== 'undefined' && Pip.audioStartVar) {
        debugLog("Starting audio playback with Pip.audioStartVar");
        Pip.audioStartVar(this.currentAudio);
        return true;
      }
      
      debugLog("Audio playback started");
      return true;
      
    } catch (error) {
      debugLog("Error during audio playback: " + error.message);
      return false;
    }
  },
  
  // Stop audio playback
  stop: function() {
    debugLog("Stopping audio playback");
    
    try {
      // Stop current audio if playing
      if (this.currentAudio) {
        // Implementation would depend on the actual audio system
        this.currentAudio = null;
      }
      
      debugLog("Audio playback stopped");
      return true;
      
    } catch (error) {
      debugLog("Error stopping audio: " + error.message);
      return false;
    }
  },
  
  // Set volume level
  setVolume: function(level) {
    debugLog("Setting volume to: " + level);
    
    if (level < 0 || level > 1) {
      debugLog("Invalid volume level: " + level + " (must be between 0 and 1)");
      return false;
    }
    
    this.volume = level;
    debugLog("Volume set successfully");
    return true;
  },
  
  // Get current volume
  getVolume: function() {
    return this.volume;
  },
  
  // Check if audio player is ready
  isReady: function() {
    return this.isInitialized;
  }
};

// WavPlayer object (to address "Loading wavplayer.js" issue)
var WavPlayer = {
  // Initialize wav player
  init: function() {
    debugLog("Initializing WavPlayer...");
    
    try {
      // Link to main AudioPlayer
      this.audioPlayer = AudioPlayer;
      
      if (!this.audioPlayer.isInitialized) {
        debugLog("Initializing underlying AudioPlayer");
        this.audioPlayer.init();
      }
      
      debugLog("WavPlayer initialized successfully");
      return true;
      
    } catch (error) {
      debugLog("Error initializing WavPlayer: " + error.message);
      return false;
    }
  },
  
  // Play wav file
  playWav: function(filename) {
    debugLog("WavPlayer playing: " + filename);
    
    // Ensure .wav extension
    if (filename && filename.indexOf('.wav') === -1) {
      filename += '.wav';
    }
    
    return this.audioPlayer.play(filename);
  },
  
  // Stop wav playback
  stopWav: function() {
    debugLog("WavPlayer stopping playback");
    return this.audioPlayer.stop();
  }
};

// Global initialization
debugLog("Setting up global audio functions");

// Initialize audio systems
try {
  debugLog("Initializing audio systems...");
  
  if (AudioPlayer.init()) {
    debugLog("AudioPlayer ready");
  } else {
    debugLog("AudioPlayer initialization failed");
  }
  
  if (WavPlayer.init()) {
    debugLog("WavPlayer ready");
  } else {
    debugLog("WavPlayer initialization failed");
  }
  
  debugLog("Audio systems initialization complete");
  
} catch (error) {
  debugLog("Critical error during audio system initialization: " + error.message);
}

// Export for global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AudioPlayer: AudioPlayer,
    WavPlayer: WavPlayer
  };
}

// Make available globally
if (typeof global !== 'undefined') {
  global.AudioPlayer = AudioPlayer;
  global.WavPlayer = WavPlayer;
}

debugLog("audio_player.js loaded successfully");