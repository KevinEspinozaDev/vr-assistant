import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  API_URL_CHAT_GPT: string = environment.API_URL_CHAT_GPT;
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

    return this.httpClient.post(this.API_URL_CHAT_GPT, body, this.options);
  }
}
