import { Component } from '@angular/core';
import { GoogleMap, MapMarker,MapInfoWindow } from '@angular/google-maps';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-map',
  imports: [GoogleMap,MapMarker,NgIf,MapInfoWindow],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
@Injectable({providedIn: 'root'})
export class Map {
private http = inject(HttpClient);
errorMessage: String | null=null;
reports:Array<any>=[];
map_loaded: Boolean=false;
@ViewChild(MapInfoWindow)
  info_window!: MapInfoWindow;
selected_report:any;
constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ){}


ngOnInit(){
  const subject = webSocket<any>('wss://brudwawa.duckdns.org/ws');
  subject.subscribe({
    next: msg => {
      this.reports.push(msg.report);
      console.log(msg);
      this.changeDetectorRef.detectChanges();

    }, 
    error: err => console.log(err), 
    complete: () => console.log('complete') 
  });
  this.http.get<any>(`${sessionStorage.getItem("apiURL")}/api/reports?status=approved`).subscribe({
    next: data => {
      for(let dat of data){
        switch(dat.category){
          case "smieci": dat.category="Illegal trashyard"; break;
          case "graffiti": dat.category="graffiti"; break;
          case "dziura_w_drodze": dat.category="Road damage"; break;
          case "uszkodzona_infrastruktura": dat.category="Damaged infrastruction"; break;
          case "zanieczyszczenie_wody": dat.category="Water pollution"; break;
          case "zanieczyszczenie_powietrza": dat.category="Pollution"; break;
          case "niebezpieczne_drzewo": dat.category="Dangerous foliage"; break;
          default: dat.category=dat.category.replace("_"," ");
        }
        this.reports.push(dat);
      }
      this.map_loaded=true;
      this.changeDetectorRef.detectChanges();
    },
    error: (error) => {
      this.errorMessage = error.error.detail;
      console.error('There was an error!', error);
      this.changeDetectorRef.detectChanges();
    }
  })
}
 
  
  center: google.maps.LatLngLiteral = {
    lat: 52.2297,
    lng: 21.0122
  };
  zoom = 12;
  mapClick(event: google.maps.MapMouseEvent) {}
  openInfo(marker: MapMarker, report: any) {
    this.selected_report = report;
    this.info_window.open(marker);
  }
  to_report(){
    this.router.navigate(['/issue/'+this.selected_report.id])
  }
  markerOptions1: google.maps.MarkerOptions = {
  icon: {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    scale: 10,
    fillColor: '#bbf451',
    fillOpacity: 1,
    strokeColor: 'oklch(87.9% 0.169 91.605)',
    strokeWeight: 2,
  }
  };
  markerOptions2: google.maps.MarkerOptions = {
  icon: {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    scale: 10,
    fillColor: 'oklch(90.5% 0.182 98.111)',
    fillOpacity: 1,
    strokeColor: 'oklch(87.9% 0.169 91.605)',
    strokeWeight: 2,
  }
  };
  markerOptions3: google.maps.MarkerOptions = {
  icon: {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    scale: 10,
    fillColor: 'oklch(75% 0.183 55.934)',
    fillOpacity: 1,
    strokeColor: 'oklch(87.9% 0.169 91.605)',
    strokeWeight: 2,
  }
  };
  markerOptions4: google.maps.MarkerOptions = {
  icon: {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    scale: 10,
    fillColor: '#fb2c36',
    fillOpacity: 1,
    strokeColor: 'oklch(87.9% 0.169 91.605)',
    strokeWeight: 2,
  }
  };
  markerOptions5: google.maps.MarkerOptions = {
  icon: {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    scale: 10,
    fillColor: '#82181a',
    fillOpacity: 1,
    strokeColor: 'oklch(87.9% 0.169 91.605)',
    strokeWeight: 2,
  }
  };
  marker_versions: Array<google.maps.MarkerOptions>=[this.markerOptions1,this.markerOptions2,this.markerOptions3,this.markerOptions4,this.markerOptions5];
  
}