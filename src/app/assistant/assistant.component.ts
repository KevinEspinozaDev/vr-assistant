import { Component } from '@angular/core';
import { ChatGptService } from '../services/chat-gpt.service';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { Router } from '@angular/router';
import { ElevenLabsService } from '../services/eleven-labs.service';
import { environment } from 'src/environments/environment.prod';

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
    }, 2000);
  }

  initialize(): void{
    this.isDataReady = true;
  }

  async startRecognition() {
    this.isSpeaking = true;

    if (this.isSpeaking) {
      await this.voiceRecognitionService.start(); // Espera a que termine el reconocimiento

      const text = localStorage.getItem('textVoice')!;
      this.voiceToTextRecognized = text;

      // Reset
      this.stopRecognition();

      this.sendToChatGPT(this.voiceToTextRecognized);
    }
  }

  stopRecognition() {
    this.voiceRecognitionService.stop();
    this.isSpeaking = false;
  }

  sendToChatGPT(voiceToTextRecognized: string = 'No se pudo reconocer la voz. Por favor, pide que intente de nuevo.') {

    /*
    ? TODO: ChatGPT no recuerda conversaciones anteriores.
    ? Investigar almacenar conversaciones para un usuario.
    */
    this.chatGPTService.send(voiceToTextRecognized)
    .subscribe({
      next: res => {
        const respuesta: string = res.choices[0].message.content;
        this.chatGPTResponse = respuesta;

        this.sendChatGPTToVoice(this.chatGPTResponse);
      }
    });
  }

  sendChatGPTToVoice(chatGPTResponse: string){

    this.elevenLabsService.generate(
      chatGPTResponse,
      "eleven_multilingual_v2",
      0.9,
      0.85,
      0.2,
      true
    )
    .subscribe({
      next: (blob: Blob) => {
        if (blob) {
          this.playAudio(blob);
        }
      },
      error: error => {
        console.error('Error generating voice:', error);
      }

    });
  }

  playAudio(blob: Blob) {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
  }

  playSample(): void{
    const audio = new Audio('assets/audios/Sample.mp3');
    audio.play();
  }

  salir(): void{
    this.router.navigateByUrl('menu');
  }

}
