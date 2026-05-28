import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule,FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth';

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
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  returnUrl: string = '';
  loading = false;
   constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
  }
  log_in(){
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
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
  }
}
