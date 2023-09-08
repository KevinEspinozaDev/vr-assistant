import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import 'aframe-event-set-component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


  formSettings: FormGroup = this.formBuilder.group({
    // Settings before starting
  });

  env = environment.env;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
  ){

  }

  ngOnInit(): void {

  }

  startAssistant(): void{
    this.router.navigateByUrl('assistant');
  }


}
