import { Component } from '@angular/core';
import { ChatGptService } from '../services/chat-gpt.service';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { Router } from '@angular/router';
import { ElevenLabsService } from '../services/eleven-labs.service';
import { environment } from 'environments/environment';

// for Voice Recognition
declare var responsiveVoice: any;
declare var webkitSpeechRecognition: any;


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

  conversation: string = '';

  webkitSpeechRecognition: any;
  recognition = new webkitSpeechRecognition();
  recognizedText: string = '';

  isDataReady = false;
  isSpeaking: boolean = false;

  constructor(
    private router: Router,
    private chatGPTService: ChatGptService,
    private voiceRecognitionService: VoiceRecognitionService,
    private elevenLabsService: ElevenLabsService
  ){

  }

  ngOnInit(): void {

    setTimeout(() => {
      this.initialize();
    }, 3000);
  }

  initialize(): void{
    this.voiceRecognitionService.init();
    this.isDataReady = true;
  }

  // TODO! reiniciar el ciclo de escucha-transcripción y luego desactivar mic
  async startRecognition() {
    this.isSpeaking = true;

    if (this.isSpeaking) {
      await this.voiceRecognitionService.start(); // Espera a que termine el reconocimiento
      // Coloca aquí la lógica que deseas ejecutar después de que termine el reconocimiento
      const text = localStorage.getItem('textVoice')!;
      this.voiceToTextRecognized = text;

      // Reset
      this.isSpeaking = false;
      this.stopRecognition();
    }
  }

  stopRecognition() {
    console.log('stopRecognition')
    this.voiceRecognitionService.stop();
    this.isSpeaking = false;
  }

  sendToChatGPT() {

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
    this.isSpeaking = !this.isSpeaking;
  }

  salir(): void{
    this.router.navigateByUrl('menu');
  }

}
