import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { TokenStorageService } from '../core/token-storage';


@Component({
  selector: 'app-issue-view',
  imports: [NgIf],
  templateUrl: './issue-view.html',
  styleUrl: './issue-view.css',
})
@Injectable({providedIn: 'root'})
export class IssueView {
  private http = inject(HttpClient);
  report:any;
  errorMessage: string | null = null;
  report_ready=false;
  report_id: String | null="";
  image_path="";
  danger_color="";
  user_email="";
  score=0;
  voted=0;
  voting=false;
  comments:any;
  comments_ready=false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private tokenService: TokenStorageService,
  ){}
  ngOnInit(){
    this.route.paramMap.subscribe((obs) => {
      this.report_id=obs.get('id');
    });

    if(!this.report_id) return;
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/api/reports/${this.report_id}`).subscribe({
    next: data => {

      this.report=data;
      switch(data.category){
          case "smieci": data.category="Illegal trashyard"; break;
          case "graffiti": data.category="graffiti"; break;
          case "dziura_w_drodze": data.category="Road damage"; break;
          case "uszkodzona_infrastruktura": data.category="Damaged infrastruction"; break;
          case "zanieczyszczenie_wody": data.category="Water pollution"; break;
          case "zanieczyszczenie_powietrza": data.category="Pollution"; break;
          case "niebezpieczne_drzewo": data.category="Dangerous foliage"; break;
          default: data.category=data.category.replace("_"," ");
        }
      if(this.report.image_key) this.image_path=sessionStorage.getItem("apiURL")+"/api/images/"+this.report.image_key;
      switch(this.report.threat_level){
        case 1: this.danger_color="bg-lime-300";break;
        case 2: this.danger_color="bg-yellow-300";break;
        case 3: this.danger_color="bg-orange-400";break;
        case 4: this.danger_color="bg-red-500";break;
        case 5: this.danger_color="bg-red-900";break;
        default: this.danger_color="bg-lime-300";
      }
      //user data
      this.http.get<any>(`${sessionStorage.getItem("apiURL")}/api/users/${this.report.user_id}`).subscribe({
        next: data => {
          this.user_email=data.email;
          this.changeDetectorRef.detectChanges();

        },
        error: (error) => {
          this.errorMessage = error.error.detail;
          console.error('There was an error!', error);
          this.changeDetectorRef.detectChanges();

        }
      })
      //comment data
      this.http.get<any>(`${sessionStorage.getItem("apiURL")}/api/reports/${this.report_id}/comments`).subscribe({
        next: data => {
          this.comments=data;
          this.comments_ready=true;
          this.changeDetectorRef.detectChanges();

        },
        error: (error) => {
          this.errorMessage = error.error.detail;
          console.error('There was an error!', error);
          this.changeDetectorRef.detectChanges();

        }
      })
      //votes data
      this.http.get<any>(`${sessionStorage.getItem("apiURL")}/api/reports/${this.report_id}/votes`).subscribe({
        next: data => {
          this.score=data.score;
          this.changeDetectorRef.detectChanges();

        },
        error: (error) => {
          this.errorMessage = error.error.detail;
          console.error('There was an error!', error);
          this.changeDetectorRef.detectChanges();
          
        }
      })


      this.report_ready=true;
      this.changeDetectorRef.detectChanges();
    },
    error: (error) => {
      this.errorMessage = error.error.detail;
      console.error('There was an error!', error);
    }
  })
  }
  vote(val:number){
    if(this.voting) return
    this.voting=true;
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/api/reports/${this.report_id}/vote`,{value:val}).subscribe({
      next: data => {
        this.voting=false;
        if(!data){
          this.score-=val;
          this.voted=0;
        }
        else{
          if(this.voted!=0 && this.voted!=val){
            this.score+=val;
            this.score+=val;
          }
          if(this.voted==0){
            this.score+=val;
          }
          this.voted=val;
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error.detail;
        console.error('There was an error!', error);
        this.changeDetectorRef.detectChanges();
        this.voting=false;
      }
    })
  }
  add_comment(){
    let input=document.getElementById("comment_add") as HTMLInputElement;
    let content=input.value;
    if(!content) return;
    input.value="";
    this.comments.push({user_id:this.tokenService.getUser().sub,content:content});
    this.changeDetectorRef.detectChanges();

    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/api/reports/${this.report_id}/comments`,{content:content}).subscribe({
      next: data => {
      },
      error: (error) => {
        this.errorMessage = error.error.detail;
        console.error('There was an error!', error);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
}
/*
  category: "zionists"
  created_at: "2026-06-05T14:34:56.054873Z"
  description: "test of hand written submit"
  district
  
  id
 
  image_key
  
  latitude
  
  longitude
 
  status
  
  suggested_service
 
  threat_level
  
  title
 
  updated_at
  
  user_id
  */
