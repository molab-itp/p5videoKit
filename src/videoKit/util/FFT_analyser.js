export class FFT_analyser {
  constructor(props) {
    // { media }
    Object.assign(this, props);
    // console.log('fft_anal this', this);
    this.init_analyser();
  }

  init_analyser() {
    // console.log('FFT_analyser media', this.media);
    let aAudioContext = getAudioContext();
    aAudioContext.resume();
    // sound_AudioContext_resume();
    if (!this.media.mediaDevice) return;
    let stream = this.media.mediaDevice.stream;
    this.analyser = aAudioContext.createAnalyser();
    try {
      let source = aAudioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
    } catch (err) {
      console.log('createMediaStreamSource err', err);
    }
    this.spectrum_arr = new Uint8Array(this.analyser.frequencyBinCount);
    // console.log('fft_anal this.spectrum_arr.length', this.spectrum_arr.length);
  }

  spectrum() {
    if (!this.analyser) return [];
    this.analyser.getByteFrequencyData(this.spectrum_arr);
    return this.spectrum_arr;
  }
}

export function sound_AudioContext_resume() {
  console.log('getAudioContext().state', getAudioContext().state);
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
