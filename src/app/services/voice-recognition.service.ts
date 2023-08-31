import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecognition = false;
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

  start(): void{
    this.isStoppedSpeechRecognition = false;
    this.recognition.start();
    console.log('_Recognition started');

    // Ejecución constante
    this.recognition.addEventListener('end', (condition:any) => {

      if (this.isStoppedSpeechRecognition) {
        this.recognition.stop();
        console.log('_Recognition finished.');
      }else{
        this.setText();
        this.recognition.start(); // Vuelve a escuchar
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
    this.setText();
    this.recognition.stop();
    console.log('_Recognition finished');
  }

}
