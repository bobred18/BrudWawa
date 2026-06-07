import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
@Injectable({providedIn: 'root'})
export class Admin {
  private http = inject(HttpClient);
  reports:Array<any>=[];
  reports_loaded=false;
  errorMessage="";
  edit_visible=false;
  edited_report:any;
  inputForm: FormGroup;

constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
  ){
    this.inputForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.minLength(10)],
      category: ['',Validators.required],
      danger_level: ['',Validators.required],
      institution: ['',Validators.required],
    });
  }
  ngOnInit(){
    this.fetch_pending();
  }
  async fetch_pending(){
    this.reports_loaded=false;
    await new Promise(r => setTimeout(r, 300));
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/api/admin/reports?status=pending`).subscribe({
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
          dat.suggested_service=dat.suggested_service.replace("_"," ");
          this.reports.push(dat);
        }
        this.reports_loaded=true;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error.detail;
        console.error('There was an error!', error);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
  async fetch_all(){
    this.reports_loaded=false;
    await new Promise(r => setTimeout(r, 300));
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/api/admin/reports`).subscribe({
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
          dat.suggested_service=dat.suggested_service.replace("_"," ");
          this.reports.push(dat);
        }
        this.reports_loaded=true;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error.detail;
        console.error('There was an error!', error);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
  get_image(report:any){
    return sessionStorage.getItem("apiURL")+"/api/images/"+report.image_key;
  }
  accept(report:any){
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/api/admin/reports/${report.id}/approve`,{}).subscribe({
      next: data => {
        console.log(data);
        this.reports.splice(this.reports.indexOf(report),1);
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error.detail;
        console.error('There was an error!', error);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
  reject(report:any){
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/api/admin/reports/${report.id}/reject`,{}).subscribe({
      next: data => {
        console.log(data);
        this.reports.splice(this.reports.indexOf(report),1);
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error.detail;
        console.error('There was an error!', error);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
  edit(report:any){
    this.edited_report=report;

    this.inputForm.get('title')?.setValue(report.title);
    this.inputForm.get('description')?.setValue(report.description);
    this.inputForm.get('danger_level')?.setValue(report.threat_level);
    this.inputForm.get('category')?.setValue(report.category);
    let category=report.suggested_service;
    switch(category){
      case "straz_miejska": category="City inspection"; break;
      case "sanepid": category="Health inspection"; break;
      case "straz_pozarna": category="Firefighters"; break;
      case "zarzad_drog": category="Road department"; break;
      case "wodociagi": category="Water lord"; break;
      default: ;
    }
    this.inputForm.get('institution')?.setValue(category);

    this.edit_visible=true;
    this.changeDetectorRef.detectChanges();
    var input =document.getElementById(report.threat_level) as HTMLInputElement;
    input.checked=true;
    this.changeDetectorRef.detectChanges();


  }
  delete(report:any){
    this.http.delete<any>(`${sessionStorage.getItem("apiURL")}/api/admin/reports/${report.id}`).subscribe({
      next: data => {
        console.log(data);
        this.reports.splice(this.reports.indexOf(report),1);
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error.detail;
        console.error('There was an error!', error);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
  file_report(){
    const {title, description, category, danger_level, institution}=this.inputForm.value;
    this.http.patch<any>(`${sessionStorage.getItem("apiURL")}/api/admin/reports/${this.edited_report.id}`,{
      title:title,description:description,category:category,threat_level:danger_level,suggested_service:institution
    }).subscribe({
      next: data => {
        this.edited_report.title=title;
        this.edited_report.description=description;
        this.edited_report.category=category;
        this.edited_report.threat_level=danger_level;
        this.edited_report.suggested_service=institution;
        this.edit_visible=false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error.detail;
        console.error('There was an error!', error);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
}/*
category
: 
"other"
created_at
: 
"2026-06-05T15:29:40.792534Z"
description
: 
"qeqeqqeqeqeqeeq"
district
: 
null
id
: 
13
image_key
: 
"87cebd02-2e52-4131-8c42-7e6d99b28378.webp"
latitude
: 
52.23551200868915
longitude
: 
21.010140063476566
status
: 
"pending"
suggested_service
: 
"other"
threat_level
: 
5
title
: 
"wqeqe"
updated_at
: 
"2026-06-05T15:29:40.792534Z"
user_id
: 
2*/