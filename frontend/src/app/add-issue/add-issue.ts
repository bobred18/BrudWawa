import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-issue',
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './add-issue.html',
  styleUrl: './add-issue.css',
})
export class AddIssue {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  returnUrl: string = '';
  loading = false;
  constructor(
    private fb: FormBuilder
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(5)],
      password2: ['',],
    });
  }
  ask_clanker(){
    
  }
  file_report(){

  }
}
