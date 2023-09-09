import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleSpeechService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  send(text: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer `
    });

    const requestData = {
      "input": { text: text },
      "voice": { languageCode: 'es-ES', ssmlGender: 'FEMALE' },
      "audioConfig": { audioEncoding: 'MP3' }
    };

    return this.httpClient.post('', requestData, { headers: headers });
  }
}
