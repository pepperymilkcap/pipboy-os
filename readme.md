# Wand Company Pip-Boy Device Reference Guide
# Generated Via Claude Scanning a RAM Dump
## Hardware Inputs, Functions, and Programming Interface

### HARDWARE INPUTS & CONTROLS

#### Physical Buttons:
- BTN_POWER (A0) - Power button with long press detection
- BTN_PLAY (A1) - Play/select button
- BTN_TORCH (A2) - Torch/flashlight button with debounce (49.99ms)
- BTN_TUNEUP (E1) - Tune up button
- BTN_TUNEDOWN (E2) - Tune down button

#### Knobs & Encoders:
- KNOB1 (Rotary Encoder):
  - KNOB1_A (B1) - Encoder channel A
  - KNOB1_B (B0) - Encoder channel B  
  - KNOB1_BTN (A3) - Push button with debounce (19.99ms)
  - Generates click sounds: Pip.knob1Click(direction)

- KNOB2 (Rotary Encoder):
  - KNOB2_A (A10) - Encoder channel A
  - KNOB2_B (A8) - Encoder channel B
  - Generates audio feedback: Pip.knob2Click(direction)

#### Analog Inputs:
- MODE_SELECTOR (A7) - 5-position analog mode selector
- VUSB_MEAS (A5) - USB voltage measurement
- VBAT_MEAS (A6) - Battery voltage measurement
- RADIO_AUDIO (A4) - Radio audio input

#### Digital Sensors:
- VUSB_PRESENT (A9) - USB connection detection
- CHARGE_STAT (C5) - Battery charging status
- SDCARD_DETECT (A15) - SD card presence detection

### OUTPUT CONTROLS

#### LEDs:
- LED_RED (E4) - Red status LED
- LED_GREEN (E5) - Green status LED  
- LED_BLUE (E6) - Blue status LED
- LED_TUNING (E3) - Radio tuning indicator LED
- LCD_BL (B15) - LCD backlight control

#### Power Management:
- MEAS_ENB (C4) - Measurement enable pin

### DEVICE MODES & NAVIGATION

#### Operating Modes (MODE enum):
- TEST (0) - Factory test mode
- STAT (1) - Status/statistics mode
- INV (2) - Inventory mode  
- DATA (3) - Data mode
- MAP (4) - Map mode
- RADIO (5) - Radio mode

#### Mode Selection Logic:
Mode determined by MODE_SELECTOR analog voltage:
- >0.9V: Fallback mode (from settings)
- >0.7V: RADIO (5)
- >0.5V: MAP (4) 
- >0.3V: DATA (3)
- >0.1V: INV (2)
- ≤0.1V: STAT (1)

### PROGRAMMING INTERFACE

#### Core Pip Object Methods:
- Pip.isSDCardInserted() - Check SD card status
- Pip.setDateAndTime(date) - Set system date/time
- Pip.getDateAndTime() - Get current date/time
- Pip.measurePin(pin, samples, precision) - Analog measurement
- Pip.getID() - Get unique device ID
- Pip.kickIdleTimer() - Reset idle timeout
- Pip.addWatches() - Initialize input monitoring
- Pip.updateBrightness() - Apply brightness settings

#### Audio System:
- Pip.audioStart(filename) - Play audio file
- Pip.audioStartVar(data) - Play audio from variable
- Pip.audioBuiltin(name) - Get built-in audio clips
- Pip.knob1Click(direction) - Knob 1 click sound
- Pip.knob2Click(direction) - Knob 2 click sound

#### Video System:
- Pip.videoStart(filename, options) - Play video file
- Options: {x, y, repeat, height}
- Event: "videoStopped" when playback ends

#### Display Graphics:
- bC - Main content buffer (Graphics object)
- bH - Header buffer
- bF - Footer buffer
- BGRECT = {x:36, y:58, w:408, h:230} - Background area
- bC.flip() - Update display

#### Power Management:
- Pip.sleeping - Sleep state ("BUSY", true, false)
- Pip.offOrSleep(options) - Enter sleep/off mode
- Pip.fadeOff(pins, brightness) - Fade out animation
- Pip.fadeOn(pins, brightness) - Fade in animation
- Pip.brightness - Current brightness level (0-40)

#### Event System:
- Pip.on(event, handler) - Add event listener
- Events: "knob1", "knob2", "torch", "videoStopped"
- Pip.emit(event, data) - Trigger event

### RADIO FUNCTIONALITY

#### Radio Object (rd):
- rd.freq - Current frequency (MHz)
- rd.enable(state) - Turn radio on/off
- rd.freqSet(frequency) - Set frequency
- rd.seek(up) - Seek stations up/down
- rd.getVol() / rd.setVol(level) - Volume control
- rd.getRSSI() - Signal strength
- rd.isOn() - Check if radio is enabled

#### RDS Support:
- rd.useRDS - RDS data decoding enabled
- stationName - Current station name
- readRDSData() - Process RDS information

### SETTINGS SYSTEM

#### Configuration Object (settings):
```javascript
{
  idleTimeout: 300000,        // 5 minutes in ms
  alarm: {
    time: null,
    enabled: false,
    repeat: false,
    soundIndex: 1,
    soundFiles: [...],
    snooze: 10
  },
  fallbackMode: 5,
  longPressToWake: false,
  timezone: 1,
  century: 20,
  color: {r:0, g:255, b:0, scanline:128, overscan:128},
  clock12hr: true
}
