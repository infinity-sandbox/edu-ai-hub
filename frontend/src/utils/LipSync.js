class LipSync {
  constructor(videoElement, modelPath) {
    this.videoElement = videoElement;
    this.model = null;

    fetch(modelPath)
      .then(response => response.json())
      .then(data => {
        this.model = data;
      });
  }

  play(audioSrc) {
    if (!this.model) return;

    const audio = new Audio(audioSrc);
    audio.play();

    this.model.animations.forEach(animation => {
      setTimeout(() => {
        this.animateMouth(animation.phonemeSequence);
      }, animation.startTime * 1000);
    });
  }

  animateMouth(sequence) {
    const phonemes = this.model.phonemes;
    const mouth = document.getElementById('mouth');
    sequence.split('-').forEach((phonemeId, index) => {
      const phoneme = phonemes.find(p => p.id === phonemeId);
      if (phoneme) {
        setTimeout(() => {
          Array.from(mouth.children).forEach(child => {
            child.style.display = 'none';
          });
          document.getElementById(phoneme.mouthShape).style.display = 'block';
        }, index * phoneme.duration * 1000);
      }
    });
  }
}

export default LipSync;
