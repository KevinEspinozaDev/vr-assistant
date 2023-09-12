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
  gettingAudio: boolean = false;
  audioReady: boolean = false;
  notRecognizedOrVoid: boolean = false;

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
    this.audioReady = false;
    this.notRecognizedOrVoid = false;

    await this.voiceRecognitionService.start(); // Espera a que termine el reconocimiento

    const text = localStorage.getItem('textVoice')!;
    this.voiceToTextRecognized = text;

    // Reset
    this.stopRecognition();

    if (this.voiceToTextRecognized !== "" && this.voiceToTextRecognized.length > 3) {
      this.sendToChatGPT(this.voiceToTextRecognized);
    }else{
      this.notRecognizedOrVoid = true;
    }

  }

  stopRecognition() {
    this.voiceRecognitionService.stop();
    this.isSpeaking = false;
  }

  sendToChatGPT(voiceToTextRecognized: string = 'No se pudo reconocer la voz. Por favor, pide que intente de nuevo.') {

    const finalOrderToChatGPT: string = this.addExtraPhrasesToOrder(voiceToTextRecognized);

    /*
    ? TODO: ChatGPT no recuerda conversaciones anteriores.
    ? Investigar almacenar conversaciones para un usuario.
    */
    this.chatGPTService.send(finalOrderToChatGPT)
    .subscribe({
      next: res => {
        const respuesta: string = res.choices[0].message.content;
        this.chatGPTResponse = respuesta;

        this.sendChatGPTToVoice(this.chatGPTResponse);
      }
    });
  }

  addExtraPhrasesToOrder(phrase: string): string{
    const order1: string = 'Por favor responde con solo una oración o si es necesario con menos de 70 palabras.';
    return `${phrase}. ${order1}.`;
  }

  sendChatGPTToVoice(chatGPTResponse: string){

    this.gettingAudio = true;

    this.elevenLabsService.generate(
      chatGPTResponse,
      "eleven_multilingual_v2",
      0.5,
      0.5,
      0.25,
      true
    )
    .subscribe({
      next: (blob: Blob) => {
        if (blob) {
          this.audioReady = true;
          this.gettingAudio = false;
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

  reload(): void{
    window.location.reload();
  }

  salir(): void{
    this.router.navigateByUrl('menu');
  }

}
