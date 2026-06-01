import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
    private router: Router
  ){}
  logged:boolean=false;
  ngOnInit(){
    if(sessionStorage.getItem("logged")) this.logged=true;
  }
  to_stats(){
    this.router.navigate(['/statistics']);
  }
  to_map(){
    this.router.navigate(['/map']);
  }
  to_report(){
    this.router.navigate(['/report']);
  }
  to_log(){
    this.router.navigate(['/login']);
  }
  to_profile(){
    this.router.navigate(['/profile'])
  }
}
