import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecognition = false;
  public text = '';
  tempWords: string = '';

  constructor() { }

  init(){

    this.recognition.addEventListener('result', (e:any) => {
      const transcript = Array.from(e.results)
      .map((result:any) => result[0])
      .map((result:any) => result.transcript)
      .join('');

      this.tempWords = transcript;
      console.log(transcript);
    });
  }

  start(){
    this.isStoppedSpeechRecognition = false;
    this.recognition.start();
    console.log('recognition started')

    this.recognition.addEventListener('end', (condition:any) => {

      if (this.isStoppedSpeechRecognition) {
        this.recognition.stop();
        console.log('Recognition finished');
      }else{
        this.wordConcat();
        this.recognition.start();
      }

    });
  }

  stop(){
    this.isStoppedSpeechRecognition = true;
    this.wordConcat();
    this.recognition.stop();
    console.log('Recognition finished');
  }

  wordConcat(){
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
  }
}
