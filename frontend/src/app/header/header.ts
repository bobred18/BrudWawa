import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../core/token-storage';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
    
  ){}
  is_admin=false;
  ngOnInit(){
    this.is_admin=this.tokenService.getUser()?.is_admin;
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
  log_out(){
    this.tokenService.clear();
    this.router.navigate(['/login'])
  }
  to_admin(){
    this.router.navigate(['/admin']);
  }
}
