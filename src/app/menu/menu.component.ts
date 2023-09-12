import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import 'aframe-event-set-component';
import { VoiceRecognitionService } from '../services/voice-recognition.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


  formSettings: FormGroup = this.formBuilder.group({
    // Settings before starting
  });

  permissionOk: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,

    private voiceRecognitionService: VoiceRecognitionService
  ){

  }

  ngOnInit(): void {

  }

  startAssistant(): void{
    this.router.navigateByUrl('assistant');
  }

  micPermission(): void{
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      this.permissionOk = true;
    });
  }

}
