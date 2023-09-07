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
    this.init();
    this.recognition.lang = 'es-ES';
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

      /*
      TODO No se cierra correctamente el reconocimiento.
      TODO Se ejecuta el evento end consecutivamente. Puede ocasionar
      TODO memory leaks.
      */
      this.recognition.addEventListener('end', () => {
        this.setText();

        // Resuelve la promesa cuando el reconocimiento termine
        resolve();
      });

    });
  }

  getText(): string{
    return this.text;
  }

  setText(){
    this.text = this.tempWords;
    localStorage.setItem('textVoice', this.text);
  }

  stop() {
    this.recognition.stop();
    this.recognition.abort();
    this.recognition.listEvent
    console.log('_Recognition finished');
  }

}
