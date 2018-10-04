const MediaStreamRecorder = require('msr');

customElements.define(
  'my-camera',
  class extends HTMLElement {
    private _shadow = this.attachShadow({ mode: 'closed' });
    private _video: HTMLVideoElement;
    private _error: HTMLParagraphElement;
    private _record: HTMLButtonElement;
    private _pauseRecord: HTMLButtonElement;
    private _recorder: any;
    constructor() {
      super();

      this._shadow.innerHTML = this.renderHtml();

      this._video = this._shadow.querySelector('video');
      this._error = this._shadow.querySelector('p');
      this._record = this._shadow.querySelector('button.record');
      this._pauseRecord = this._shadow.querySelector('button.pause-record');

      if (!this.hasAttribute('record')) {
        this._record.remove();
        this._pauseRecord.remove();
      } else {
        this._record.addEventListener('click', () => {
          if (!this._record.hasAttribute('recording')) {
            this._record.innerText = 'Stop & Save';
            this._record.setAttribute('recording', '');
            return this._startRecording();
          } else {
            this._record.innerText = 'Record';
            this._record.removeAttribute('recording');
            return this._stopRecording();
          }
        });
        this._pauseRecord.addEventListener('click', () => {
          if (!this._pauseRecord.hasAttribute('resume')) {
            this._pauseRecord.innerText = 'Resume record';
            this._pauseRecord.setAttribute('resume', '');
            return this._pauseRecording();
          } else {
            this._pauseRecord.innerText = 'Pause record';
            this._pauseRecord.removeAttribute('resume');
            return this._resumeRecording();
          }
        });
      }
    }

    static get observedAttributes() {
      return ['autoplay', 'controls', 'audio'];
    }

    private _startRecording() {
      this._pauseRecord.removeAttribute('hidden');
      this._recorder.start(100);
    }

    private _stopRecording() {
      this._pauseRecord.setAttribute('hidden', '');
      this._pauseRecord.removeAttribute('resume');
      this._recorder.stop();
    }

    private _pauseRecording() {
      this._record.setAttribute('disabled', '');
      this._recorder.pause();
    }

    private _resumeRecording() {
      this._record.removeAttribute('disabled');
      this._recorder.resume();
    }

    private _saveVideo(blob: Blob) {
      const type = blob.type.split('/').pop();
      this._recorder.save(
        blob,
        `my-camera-${new Date().toISOString().replace(/:|\./g, '-')}.${type}`
      );
    }

    private _cameraStream() {
      if (!navigator.mediaDevices.getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        );
      }
      return navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 320, ideal: 1280, max: 1920 },
          height: { min: 240, ideal: 720, max: 1080 },
          facingMode: 'user'
        },
        audio: this.hasAttribute('audio')
      });
    }

    private _addVideoAtributes() {
      this._video.autoplay = this.hasAttribute('autoplay');
      this._video.controls = this.hasAttribute('controls');
    }

    async connectedCallback() {
      try {
        this._video.srcObject = await this._cameraStream();
        this._addVideoAtributes();
        if (this.hasAttribute('record')) {
          this._recorder = new MediaStreamRecorder(this._video.srcObject);
          // this._recorder.mimeType = 'video/webm';
          this._recorder.ondataavailable = this._saveVideo.bind(this);
        }
        this._error.remove();
      } catch (error) {
        this._video.remove();
        this._record.remove();
        this._pauseRecord.remove();
        if (error.name === 'ConstraintNotSatisfiedError') {
          this._error.innerText =
            'The resolution is not supported by your device.';
        } else if (error.name === 'NotAllowedError') {
          this._error.innerText =
            'Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.';
        } else {
          this._error.innerText = error.message;
          throw Error(error);
        }
        // this._shadow.appendChild(this._error);
      }
    }

    disconnectedCallback() {
      console.log('My Camera is disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
      // console.log(newValue);
      // console.log(name);
      // console.log(typeof newValue);
      // // if (newValue === '' || newValue === null) return;
      // if (newValue || newValue === null) {
      //   this.setAttribute(name, '');
      // } else {
      //   this.removeAttribute(name);
      // }
      // this._addVideoAtributes();
    }

    private renderHtml() {
      return `
        <style>
          :host {
            height: var(--height, 400px);
            width: var(--width, 400px);
          }

          #wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            position: relative;
            background-color: var(--background-color, #ccc);
            width: 100%;
            height: 100%;
          }


          video {
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0);
          }

          .error {
            color: var(--color, red);
            font-size: 1em;
            // font-weight: bold;
            text-align: center;
          }

          .custom-controls {
            top: 8px;
            right: 8px;
            position: absolute;
          }

          .custom-controls button {
            padding: 8px 10px;
          }

          [hidden] {
            display: none;
          }

        </style>
        <div id="wrapper">
          <video></video>
          <p class="error"></p>
          <div class="custom-controls">
            <button class="record">Record</button>
            <button class="pause-record" hidden>Pause record</button>
          </div>
        </div>
      `;
    }
  }
);
