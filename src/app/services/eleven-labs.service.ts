import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElevenLabsService {

  key: string;
  apiUrl: string;
  headers: any;

  voices: string[] = ['XB0fDUnXU5powFXDhCwa']; //Charlotte
  model_id: string = 'eleven_multilingual_v2';

  idVoice: string = '';

  data: any;

  options: any;

  constructor(
    private httpClient: HttpClient
  ) {
      this.key = environment.KEY_ELEVENLABS;

      // test
      this.setIdVoice(this.voices[0]);

      this.apiUrl = `${environment.API_URL_ELEVENLABS}${this.idVoice}/stream`;

      this.headers = {
        'Accept': 'application/json',
        'xi-api-key': this.key
      };

      this.options = { headers: this.headers };
  }

  generate(text: string): Observable<any>{

    const body = {
      text: text
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
    this.idVoice = id;
  }
}
