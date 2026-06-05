import { Component } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import Chart from 'chart.js/auto';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-statistics',
  imports: [NgIf],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
@Injectable({providedIn: 'root'})
export class Statistics {
  constructor(private changeDetectorRef: ChangeDetectorRef){}
  by_category:any;
  by_status:any;
  total:number=0;
  errorMessage: string="";
  donut:any;
  bar:any;
  private http = inject(HttpClient);
  ngOnInit(){
    this.http.get<any>(`${sessionStorage.getItem("apiURL")}/stats`).subscribe({
      next: data => {
        this.by_category=data.by_category;
        this.by_status=data.by_status;
        this.total=data.total;
        Chart.defaults.color = '#000';
        this.create_donut();
        this.create_bar();
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
          this.errorMessage = error.error.detail;
          console.error('There was an error!', error);
          this.changeDetectorRef.detectChanges();
      }
    })
  }
  private create_donut(){
    let keys:Array<String>=[];
    let values:Array<number>=[];
    let key_iter=this.by_category.keys();
    for(let cat of this.by_category){
      keys.push(cat.category);
      values.push(cat.count)
    }
    this.donut = new Chart("donut", {
      type: 'doughnut', 
      data: {
        labels: keys,
        datasets: [{
          
          data: values,
          backgroundColor: [
            'oklch(54.1% 0.281 293.009)',
            'oklch(66.7% 0.295 322.15)',
            'red',
            'oklch(71.2% 0.194 13.428)',
            'oklch(68.5% 0.169 237.323)',
            'oklch(55.5% 0.163 48.998)',
            'oklch(86.5% 0.127 207.078)',
            'oklch(87.1% 0.15 154.449)',       
          ],
          borderColor: [
            'oklch(54.1% 0.281 293.009)',
            'oklch(66.7% 0.295 322.15)',
            'red',
            'oklch(71.2% 0.194 13.428)',
            'oklch(68.5% 0.169 237.323)',
            'oklch(55.5% 0.163 48.998)',
            'oklch(86.5% 0.127 207.078)',
            'oklch(87.1% 0.15 154.449)',       
          ],
          borderWidth: 2,
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio:2.5,
      }

    });
  }
  private create_bar(){   
    this.bar = new Chart("bar", {
      type: 'bar', 
      data: {
        labels: ["approved","pending"],
        datasets: [{
          label: "",
          data: [this.by_status.approved,this.by_status.pending],
          backgroundColor: [
            'red',
            'oklch(68.5% 0.169 237.323)',  
          ],
          
        }],
      },
      options: {
        aspectRatio:2.5,
        plugins: {
          legend: {
            display: false
          }
        }
      }

    });
  }
}
