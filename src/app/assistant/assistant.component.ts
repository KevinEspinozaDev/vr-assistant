import { Component } from '@angular/core';
import { ChatGptService } from '../services/chat-gpt.service';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { Router } from '@angular/router';
import { ElevenLabsService } from '../services/eleven-labs.service';
import { environment } from 'environments/environment';
declare var responsiveVoice: any;

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent {

  title = 'vr-assistant';

  voiceToTextRecognized: string = '';

  pitch: number = 1; // Tono
  rate: number = 1; // Velocidad
  lang: string = 'es'; //Lenguaje
  volume: string = '1';

  audioBlobUrl: string = environment.API_URL_ELEVENLABS;
  audioUrl = 'assets/audios/';

  chatGPTResponse: string = '';


  webkitSpeechRecognition: any;
  recognition: any;
  recognizedText: string = '';


  ready = false;
  speaking: boolean = false;

  constructor(
    private router: Router,
    private chatGPTService: ChatGptService,
    private voiceRecognitionService: VoiceRecognitionService,
    private elevenLabsService: ElevenLabsService
  ){

  }

  ngOnInit(): void {
    this.voiceRecognitionService.init();

    setTimeout(() => {
      this.ready = true
    }, 3000);
  }

  interactuar() {

    this.chatGPTService.send(this.voiceToTextRecognized)
    .subscribe({
      next: res => {
        const respuesta: string = res.choices[0].message.content;
        this.chatGPTResponse = respuesta;

        this.elevenLabsService.generate(this.chatGPTResponse)
        .subscribe(
          (blob: Blob) => {
            this.playAudio(blob);
          },
          error => {
            console.error('Error generating voice:', error);
          }
        );

      }
    });

  }

  playAudio(blob: Blob) {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
  }

  startRecognition() {
    this.voiceRecognitionService.start();

    setTimeout(() => {
      const text = localStorage.getItem('textVoice')!;
      this.voiceToTextRecognized = text;
      console.log(this.voiceToTextRecognized)

        this.interactuar();
    }, 4000);
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

  test(){
    console.log('click!')
    this.speaking = !this.speaking;
  }

  salir(): void{
    this.router.navigateByUrl('menu');
  }

}
