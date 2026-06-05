import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signal } from '@angular/core';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleMap } from '@angular/google-maps';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-add-issue',
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    GoogleMap],
  templateUrl: './add-issue.html',
  styleUrl: './add-issue.css',
})
@Injectable({providedIn: 'root'})
export class AddIssue {
  inputForm: FormGroup;
  errorMessage: string | null = null;
  analMessage: string | null = null;
  loading = false;
  photo_ready=false;
  photo_sent=false;
  report_sent=false;
  image_key:string | null=null;
  selectedFile = signal<File | null>(null);
  imageSrc = signal<string | null>(null);

  private http = inject(HttpClient);
  constructor(
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
  async ask_clanker(){
    await this.upload_image();
    if(!this.image_key) return;
    this.photo_sent=true;
    
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/reports/analyze`, {image_key:this.image_key }).subscribe({
        next: data => {
            this.inputForm.get('title')?.setValue(data.title);
            this.inputForm.get('description')?.setValue(data.description);
            this.inputForm.get('danger_level')?.setValue(data.threat_level);
            var input =document.getElementById("data.threat_level") as HTMLInputElement;
            input.checked=true;
//map clanker output onto form values 
            var category=data.category;
            switch(category){
              case "smieci": category="illegal_trashyard"; break;
              case "graffiti": category="graffiti"; break;
              case "dziura_w_drodze": category="road_damage"; break;
              case "uszkodzona_infrastruktura": category="damaged_infrastruction"; break;
              case "zanieczyszczenie_wody": category="water_pollution"; break;
              case "zanieczyszczenie_powietrza": category="pollution"; break;
              case "niebezpieczne_drzewo": category="dangerous_foliage"; break;
              default: category="other";
            }
            this.inputForm.get('category')?.setValue(category);
            category=data.suggested_service;
            switch(category){
              case "straz_miejska": category="city_inspection"; break;
              case "sanepid": category="health_inspection"; break;
              case "straz_pozarna": category="firefighters"; break;
              case "zarzad_drog": category="road_department"; break;
              case "wodociagi": category="water_lord"; break;
              default: category="other";
            }
            this.inputForm.get('institution')?.setValue(category);
        },
        error: (error) => {
            if(error.error)this.analMessage = error.error.detail;
            else this.analMessage="Clanker was taken behind the shed, You can still use that lump lodged between your ears";
            this.inputForm.get('title')?.setValue("");
            console.error('There was an error!', error);
        }
      })

  }
  async file_report(){
    if(!this.photo_sent){
        await this.upload_image();
        if(!this.image_key) return;
    }
    if(this.inputForm.invalid){
        if(this.inputForm.get('title')?.hasError("required")) this.errorMessage="Add title";
        if(this.inputForm.get('description')?.hasError("minlength")) this.errorMessage="Description too short";
        if(this.inputForm.get('category')?.hasError("required")) this.errorMessage="Add category";
        if(this.inputForm.get('danger_level')?.hasError("required")) this.errorMessage="Add danger level";
        if(this.inputForm.get('institution')?.hasError("required")) this.errorMessage="Add institution";
        return;
    }
    if(this.longitude==null || this.latitude==null){
      this.errorMessage="Please select location"
      return;
    }
    this.loading=true;
    const {title, description, category, danger_level, institution}=this.inputForm.value;
    console.log(this.image_key);
    this.http.post<any>(`${sessionStorage.getItem("apiURL")}/reports`, { title:title,description:description,category:category,
      threat_level:danger_level,suggested_service:institution,image_key:this.image_key,longitude:this.longitude,latitude:this.latitude
     }).subscribe({
        next: data => {
            this.report_sent=true;
        },
        error: (error) => {
            this.errorMessage = error.error.detail;
            console.error('There was an error!', error);
            this.loading=false;
            return;
        }
      })
    this.report_sent=true;
    this.loading=false;
    this.inputForm.reset();
  }
  private async upload_image():Promise<void>{
    const file = this.selectedFile();
    if (!file) return ;
    const formData = new FormData();
    formData.append('file', file);
    this.loading=true;
    try{
      const response = await firstValueFrom(
        this.http.post<any>(`${sessionStorage.getItem("apiURL")}/uploads`, formData)
        /*.subscribe({
          next: data => {
                this.image_key=data.key;
                this.loading=false;
                return 0;
            },
            error: (error) => {
                this.analMessage = error.error.detail;
                console.error('There was an error!', error);
                this.loading=false;
                return 1;
            }
          })*/
      );
      this.image_key = response.key;
    }catch{
      this.errorMessage="Something went wrong";
    }
    return ;
  }
  input_image(event: Event) {
    this.photo_sent=false;
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    if(!["image/jpg","image/jpeg","image/png","image/webp"].find((elem)=>elem==file.type)){
      this.analMessage="Wrong file format";
      return;
    }
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSrc.set(reader.result as string);
    };
    reader.readAsDataURL(file);
    this.photo_ready=true;
  }
  mapVisible = false;

  latitude: number | null = null;
  longitude: number | null = null;

  center: google.maps.LatLngLiteral = {
    lat: 52.2297,
    lng: 21.0122
  };

  zoom = 12;

  mapClick(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;
    this.latitude = event.latLng.lat();
    this.longitude = event.latLng.lng();
    this.mapVisible=false;
  }
}
