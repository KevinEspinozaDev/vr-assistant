import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ParamsVoiceElevenLabsV2 } from '../interfaces/params-voice-eleven-labs';

@Injectable({
  providedIn: 'root'
})
export class ElevenLabsService {

  key: string;
  apiUrl: string;
  headers: any;

  voiceIDCharlotte: string = 'XB0fDUnXU5powFXDhCwa'; //Charlotte

  voiceIDSelected: string = '';

  options: object = {};

  constructor(
    private httpClient: HttpClient
  ) {
      this.key = environment.KEY_ELEVENLABS;

      // test
      this.setIdVoice(this.voiceIDCharlotte);

      this.apiUrl = `${environment.API_URL_ELEVENLABS}${this.voiceIDSelected}`;

      this.headers = {
        'Accept': 'application/json',
        'xi-api-key': this.key
      };

      this.options = { headers: this.headers };
  }

  generate(
    text: string,
    model_id: 'eleven_multilingual_v2',
    stability: number,
    similarity_boost: number,
    style: number,
    use_speaker_boost: boolean
  ): Observable<any>{

    const body: ParamsVoiceElevenLabsV2 = {
      text,
      model_id,
      voice_settings: {
          stability,
          similarity_boost,
          style,
          use_speaker_boost
      }
    };

    return this.httpClient.post<Blob>(
      `${this.apiUrl}`,
      body,
      {
        headers: this.headers,
        responseType: 'blob' as 'json'
      }
    );
  }

  setIdVoice(id: string): void{
    this.voiceIDSelected = id;
  }
}
