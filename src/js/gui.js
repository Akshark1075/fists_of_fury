import * as THREE from "three";
import { GUI } from "../../libs/dat.gui.module.js";
/*********Function for creating GUI for controlling the video and audio********/
function createGUI(video, scene) {
  const gui = new GUI();
  const listener = new THREE.AudioListener();
  const posSound = new THREE.PositionalAudio(listener);
  const audioLoader2 = new THREE.AudioLoader();

  //Adding positional audio to the cube
  audioLoader2.load("../assets/audio/music.mp4", function (buffer) {
    posSound.setBuffer(buffer);
    posSound.setRefDistance(10);
  });
  const cube = scene.getObjectByName("posAudioHelper");
  cube.add(posSound);

  //Video Folder which includes Play, Pause, Seek, Mute, Unmute functions
  const videoFolder = gui.addFolder("Video Controls");
  const stopVideoObj = {
    stop: function () {
      video.pause();
    },
  };
  const playVideoObj = {
    play: function () {
      video.play();
    },
  };

  const muteVideoObj = {
    mute: function () {
      video.volume = !video.paused ? 0 : 1;
    },
  };
  const unmuteVideoObj = {
    unmute: function () {
      video.volume = !video.paused ? 1 : 0;
    },
  };
  videoFolder.add(playVideoObj, "play").name("Play");
  videoFolder.add(stopVideoObj, "stop").name("Stop");
  videoFolder.add(muteVideoObj, "mute").name("Mute");
  videoFolder.add(unmuteVideoObj, "unmute").name("Unmute");
  const seekObj = {
    // Initial value for seeking (in seconds)
    seek: 0,
  };

  // Add seek control to GUI
  const seekController = videoFolder
    .add(seekObj, "seek", 0, video.duration)
    .step(0.1);

  // Listen for changes in the seek control
  seekController.onFinishChange(function (value) {
    video.currentTime = value;
  });

  // Update seek control value when video time changes
  video.addEventListener("timeupdate", function () {
    seekController.setValue(video.currentTime);
  });
  videoFolder.open();

  //Audio Folder which includes Play, Pause, Pan, Mute, Unmute functions
  const soundFolder = gui.addFolder("Positional Audio");
  const playObj = {
    play: function () {
      posSound.play();
    },
  };
  const stopObj = {
    stop: function () {
      posSound.stop();
    },
  };

  const muteObj = {
    stop: function () {
      posSound.isPlaying
        ? listener.setMasterVolume(0)
        : listener.setMasterVolume(1);
    },
  };

  const unmuteObj = {
    start: function () {
      !posSound.isPlaying
        ? listener.setMasterVolume(1)
        : listener.setMasterVolume(1);
    },
  };
  soundFolder.add(stopObj, "stop");
  soundFolder.add(playObj, "play");
  soundFolder.add(cube.position, "x", -5, 5, 0.001).name("Panner");
  soundFolder.add(muteObj, "stop").name("Mute");
  soundFolder.add(unmuteObj, "start").name("Unmute");
  soundFolder.open();
}
export default createGUI;
