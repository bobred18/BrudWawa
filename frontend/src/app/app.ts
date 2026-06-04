import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './core/auth-interceptor';
import {GoogleMapsModule} from '@angular/google-maps'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,GoogleMapsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BrudWawa');
  ngOnInit(){
    sessionStorage.setItem("apiURL","https://brudwawa.duckdns.org/api")
    //https://brudwawa.duckdns.org/api  https://localhost:8000/api
  }
}
