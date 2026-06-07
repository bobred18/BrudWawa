import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../core/token-storage';

@Component({
  selector: 'app-home',
  imports: [
    NgIf
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
  ){}
  logged:boolean=false;
  is_admin=false;
  ngOnInit(){
    if(sessionStorage.getItem("logged")) this.logged=true;
    if(this.logged)this.is_admin=this.tokenService.getUser()?.is_admin;
  }
  to_stats(){
    this.router.navigate(['/statistics']);
  }
  to_map(){
    this.router.navigate(['/map']);
  }
  to_report(){
    this.router.navigate(['/add_issue']);
  }
  to_log(){
    this.router.navigate(['/login']);
  }
  log_out(){
    this.tokenService.clear();
    this.router.navigate(['/login'])
  }
  to_admin(){
    this.router.navigate(['/admin']);
  }
}
