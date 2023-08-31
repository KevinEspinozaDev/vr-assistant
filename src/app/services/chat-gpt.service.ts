import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  API_URL: string = environment.API_URL;
  key: string;
  headers: any;
  options: any;
  constructor(
    private httpClient: HttpClient
  ) {
      this.key = environment.KEY_CHATGPT;
      this.headers = { 'Authorization': `Bearer ${this.key}`};
      this.options = { headers: this.headers };
  }

  send(text: string): Observable<any>{

    const body = {
      messages: [{"role": "user", "content": text}],
      model: 'gpt-3.5-turbo',
      temperature: 0.7
    }

    return this.httpClient.post(this.API_URL, body, this.options);
  }
}
