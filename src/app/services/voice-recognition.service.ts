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
  private isRecognitionStarted = false; // Nueva variable de estado

  constructor() { }


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
    console.log('start')
    return new Promise<void>((resolve) => {

      this.recognition.start();

      if (!this.isRecognitionStarted) { // Verifica si el reconocimiento aún no ha comenzado
        this.isRecognitionStarted = true; // Establece el estado como iniciado
        this.isStoppedSpeechRecognition = false;
        console.log('_Recognition started');

        this.recognition.addEventListener('end', () => {
          if (this.isStoppedSpeechRecognition) {
            this.recognition.stop();
            console.log('_Recognition finished.');
          } else {
            console.log('setText')
            this.setText();
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

  stop() {
    this.isRecognitionStarted = false; // Establece el estado como no iniciado
    this.isStoppedSpeechRecognition = true;
    this.recognition.stop();

    console.log('_Recognition finished');
  }

}
