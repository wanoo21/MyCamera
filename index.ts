declare var MediaRecorder: any;

customElements.define(
  'my-camera',
  class extends HTMLElement {
    private _shadow = this.attachShadow({ mode: 'closed' });
    private _video: HTMLVideoElement;
    private _error: HTMLParagraphElement;
    private _record: HTMLButtonElement;
    private _recorder: any;
    private _recordedChunks: Blob[] = [];
    constructor() {
      super();

      this._shadow.innerHTML = this.renderHtml();

      this._video = this._shadow.querySelector('video');
      this._error = this._shadow.querySelector('p');
      this._record = this._shadow.querySelector('button.record');

      if (!this.hasAttribute('record')) {
        this._record.remove();
      } else {
        this._record.addEventListener('click', () => {
          if (!this._record.hasAttribute('recording')) {
            this._record.innerText = 'Recording ...';
            this._record.setAttribute('recording', '');
            return this._startRecording();
          } else {
            this._record.innerText = 'Record';
            this._record.removeAttribute('recording');
            return this._stopRecording();
          }
        });
      }
    }

    static get observedAttributes() {
      return ['autoplay', 'controls', 'audio'];
    }

    private _startRecording() {
      this._recorder.start(100);
    }

    private _stopRecording() {
      this._recorder.stop();
      const url = URL.createObjectURL(
        new Blob(this._recordedChunks, {
          type: this._recorder.mimeType
        })
      );
      const link = this._shadow.ownerDocument.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = `my-camera-record-${this._recordedChunks.length}.webm`;
      this._shadow.appendChild(link);
      link.click();
      setTimeout(() => {
        this._recordedChunks = [];
        this._shadow.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }

    private _cameraStream() {
      return navigator.mediaDevices.getUserMedia({
        video: true,
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
          this._recorder = new MediaRecorder(this._video.srcObject, {
            mimeType: 'video/webm'
          });
          this._recorder.addEventListener('dataavailable', ({ data }) => {
            this._recordedChunks.push(data);
          });
        }
        this._error.remove();
      } catch (error) {
        this._video.remove();
        this._record.remove();
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
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            position: relative;
            background-color: var(--background-color, #ccc);
            height: var(--height, 400px);
            width: var(--width, 400px);
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
            left: 8px;
            width: 100%;
            position: absolute;
          }

          .custom-controls button {
            padding: 8px 10px;
          }

        </style>
        <video></video>
        <p class="error"></p>
        <div class="custom-controls">
          <button class="record">Record</button>
        </div>
      `;
    }
  }
);
