import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleSpeechService {

  API_URL_CHAT_GPT: string = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  API_KEY: string = 'TU_CLAVE_API_DE_GOOGLE'; // Reemplaza esto con tu clave API

  constructor(
    private httpClient: HttpClient
  ) {
  }

  send(text: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.API_KEY}`
    });

    const requestData = {
      "input": { text: text },
      "voice": { languageCode: 'es-ES', ssmlGender: 'FEMALE' },
      "audioConfig": { audioEncoding: 'MP3' }
    };

    return this.httpClient.post(this.API_URL_CHAT_GPT, requestData, { headers: headers });
  }
}
