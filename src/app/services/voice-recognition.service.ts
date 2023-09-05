import { Injectable } from '@angular/core';

declare var SpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition = new SpeechRecognition();
  isStoppedSpeechRecognition = true;
  text = '';
  tempWords: string = '';

  constructor() { }

  init(){

    this.recognition.addEventListener('result', (e:any) => {

      const transcript = Array.from(e.results)
      .map((result:any) => result[0])
      .map((result:any) => result.transcript)
      .join('');

      this.tempWords = transcript;
    });
  }

  start(): Promise<void> {

    return new Promise<void>((resolve) => {

      if (this.isStoppedSpeechRecognition) {
        this.isStoppedSpeechRecognition = false;
        this.recognition.start();
        console.log('_Recognition started');

        this.recognition.addEventListener('end', () => {
          if (this.isStoppedSpeechRecognition) {
            this.recognition.stop();
            console.log('_Recognition finished.');
          } else {
            this.setText();
            this.recognition.start(); // Vuelve a escuchar
          }

          // Resuelve la promesa cuando el reconocimiento termine
          resolve();
        });
      }
    });

  }

  getText(): string{
    return this.text;
  }

  setText(){
    this.text = this.tempWords;
    localStorage.setItem('textVoice', this.text);
    this.tempWords = '';
  }

  stop(){
    this.isStoppedSpeechRecognition = true;
    this.recognition.stop();
    console.log('_Recognition finished');
  }

}
