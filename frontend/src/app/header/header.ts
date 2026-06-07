import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private router: Router
  ){}
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
    this.router.navigate(['/profile'])
  }
}
