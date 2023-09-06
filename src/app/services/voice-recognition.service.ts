import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecognition = true;
  text = '';
  tempWords: string = '';

  constructor() {

    this.recognition.addEventListener('end', this.handleRecognitionEnd.bind(this));

  }


  init() {
    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

        this.tempWords = transcript;
    });

  }

  start(): Promise<void> {

    return new Promise<void>((resolve) => {

      this.isStoppedSpeechRecognition = false;
      this.recognition.start();
      console.log('_Recognition started');

      this.recognition.addEventListener('end', () => {
        console.log(this.tempWords)
        this.setText();

        // Resuelve la promesa cuando el reconocimiento termine
        resolve();
      });

    });
  }

  getText(): string{
    return this.text;
  }

  private handleRecognitionEnd() {
    console.log(this.tempWords);
    this.setText();
  }

  setText(){
    this.text = this.tempWords;
    localStorage.setItem('textVoice', this.text);
    this.tempWords = '';
  }

  stop() {
    this.recognition.stop();
    this.recognition.abort();
    this.recognition.listEvent
    console.log('_Recognition finished');
  }

}
