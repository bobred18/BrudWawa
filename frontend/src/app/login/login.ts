import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule,FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  
})
@Injectable({providedIn: 'root'})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  returnUrl: string = '';
  loading = false;
  register=false;
  new_user=false;
  form_message="Log in";
  private http = inject(HttpClient);
   constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(5)],
      password2: ['',],
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }
  log_in(){
    if (this.loginForm.invalid)return;
    this.loading = true;

    if(!this.register){
      const { email, password} = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          sessionStorage.setItem("logged","yes");
          this.router.navigateByUrl(this.returnUrl);
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Invalid username or password';
          this.loading = false;
        }
      });
      /*this.http.post("https://brudwawa.duckdns.org/api/auth/login",{email:this.email,password:this.password}).subscribe(data =>{
        this.token=data.valueOf();
      })
      console.log(this.token);*/
    } else{
      const { email, password, password2 } = this.loginForm.value;
      if(password!=password2){
        this.errorMessage="Passwords must match"; 
        return;
      }
      this.http.post<any>(`${sessionStorage.getItem("apiURL")}/auth/register`, { email:email, password:password }).subscribe({
        next: data => {
            this.register=false;
            this.new_user=true;
        },
        error: (error) => {
            this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
    })
    }
  }
}
