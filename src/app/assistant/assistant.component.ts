import { Component } from '@angular/core';
import { ChatGptService } from '../services/chat-gpt.service';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent {

  title = 'vr-assistant';
  textToSpeak: string = 'Hello! I am your assistant. Created by Kevin Espinoza';
  pitch: number = 1; // Tono
  rate: number = 1; // Velocidad
  lang: string = 'es'; //Lenguaje
  volume: string = '1';

  webkitSpeechRecognition: any;
  recognition: any;
  recognizedText: string = '';

  constructor(
    private router: Router,
    private chatGPTService: ChatGptService,
    private voiceRecognitionService: VoiceRecognitionService
  ){

  }

  ngOnInit(): void {
    this.voiceRecognitionService.init();
  }

  handleObjetoClick() {

    /*
    this.chatGPTService.send('Hola, esta es una prueba de mi nueva app hacia la API de GPT. Me recibes?')
    .subscribe({
      next: res => {
        const respuesta: string = res.choices[0].message.content;
        console.log(respuesta);
      }
    });
    */
  }

  startRecognition() {
    console.log('start')
    this.voiceRecognitionService.start();
  }

  stopRecognition() {
    this.voiceRecognitionService.stop();
  }

  initializeVoices() {
    const voices = speechSynthesis.getVoices();

    const selectedVoice = voices.find(voice => voice.name.includes('Microsoft Sabina - Spanish (Mexico)'));

    if (selectedVoice) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.voice = selectedVoice;
      utterance.lang = this.lang;
      utterance.text = '¡Hola! Esta es una voz de mujer. Espero que estés bien';
      utterance.volume = 5;
      speechSynthesis.speak(utterance);
    } else {
      console.log('No se encontró una voz de mujer disponible.');
    }
  }


  speak() {
    const utterance = new SpeechSynthesisUtterance(this.textToSpeak);
    window.speechSynthesis.speak(utterance);
  }

  test(){
    console.log('click!')
  }

  salir(): void{
    this.router.navigateByUrl('menu');
  }

}
