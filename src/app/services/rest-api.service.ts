import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  urlBackend: string = environment.urlBackend ;

  constructor(private httpClient: HttpClient) { }

  findAll(entityName: any): Observable<any> {
    console.log('Request findAll : ' + this.urlBackend + entityName ) ;
    return this.httpClient.get<any[]>(this.urlBackend + entityName)
  }


  findById(entityName: any, id: number): Observable<any> {
    console.log('Request findById : ' + this.urlBackend + entityName + '/' + id) ;
    return this.httpClient.get<any>(this.urlBackend + entityName + '/' + id) ;
  }


  save(entityName: any, data: any): Observable<any> {
    console.log('Request save : ' + this.urlBackend + entityName) ;
    return this.httpClient.post<any>(this.urlBackend + entityName, data) ;
  }

  put(entityName: any, id: any, data: any): Observable<any> {
    console.log('Request put : ' + this.urlBackend + entityName + '/' + id) ;
    return this.httpClient.put<any>(this.urlBackend + entityName + '/' + id, data) ;
  }

  deleteById(entityName: any, id: any): Observable<any> {
    console.log('Request deleteById : ' + this.urlBackend + entityName + '/' + id) ;
    return this.httpClient.delete<any>(this.urlBackend + entityName + '/' + id) ;
  }

  findByOneAttribut(entityName: any, byAttributName: any, params1Name: any, params1Value: any ): Observable<any> {
    console.log("Request Find" + byAttributName + " : " + this.urlBackend + entityName + "/search/" + byAttributName + "/" + params1Name + "/" + params1Value ) ;
    return this.httpClient.get<any>(this.urlBackend + entityName + "/search/" + byAttributName + "/" + params1Name + "/" + params1Value) ;
  }

  findByTwoAttribut(entityName: any, byAttributName: any, params1Name: any, params1Value: any, params2Name: any, params2Value: any ): Observable<any> {
    console.log("Request Find" + byAttributName + " : " + this.urlBackend  + entityName + "/search/" + byAttributName + "/"
      + params1Name + "/" + params1Value + "&" + params2Name + "/" + params2Value ) ;
    return this.httpClient.get<any>(this.urlBackend + entityName + "/search/" + byAttributName + "/"
      + params1Name + "/" + params1Value + "&" + params2Name + "/" + params2Value ) ;
  }

  findJsonServer(entityName: any, allOthersParams: any ): Observable<any> {
    return this.httpClient.get<any>(this.urlBackend + entityName + "/" + allOthersParams) ;
  }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('image', file);
    const req = new HttpRequest('POST', this.urlBackend + 'uploadfile', formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

}
