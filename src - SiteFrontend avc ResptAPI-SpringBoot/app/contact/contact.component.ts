import { Component, OnInit } from '@angular/core';
import {AppDataState, DataStateEnum} from "../state/product.state";
import {ImageModel} from "../models/image.model";
import {RestApiService} from "../services/rest-api.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {catchError, map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {of} from "rxjs";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  imageToChange$: Observable<AppDataState<any[]>> | null = null ;
  banner: ImageModel = new ImageModel() ;
  DataStateEnum=DataStateEnum;
  closeModal?: boolean ;
  uploadedImage: any ;
  httpResponse: any;
  dbImage: any;
  isAuthenticated = localStorage.getItem('authenticated');

  constructor(private restApiService: RestApiService,
              private router: Router,private modalService: NgbModal,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initAllImage() ;
  }

  initAllImage() {
    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'contact-banner').subscribe(data => {
      this.httpResponse = data;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true;
          this.banner = this.httpResponse ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !');
      console.log(error);
    });
  }

  onChangeImage(imageIdentifier: string) {
    this.imageToChange$ = this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', imageIdentifier).pipe(
      map(data=>{
        // console.log(data);
        this.dbImage = data.image ;
        return ({dataState:DataStateEnum.LOADED,data:data})
      }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    ) ;
  }

  public onImageUpload(event: any) {
    this.uploadedImage = event.target.files[0];
    const files = event.target.files;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.message = "Only images are supported.";
      this.toastrService.warning('Veuillez Selectionner une image !') ;
      return;
    }
    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.dbImage = reader.result;
    }
  }

  onCloseModal() {
    // this.router.navigateByUrl('/home') ;
    this.initAllImage() ;
    new Promise(resolve => {
      setTimeout(() => {
        this.closeModal = false ;
      }, 1000);
    }) ;
  }

  testAndSaveImage(data: ImageModel) {
    console.log(data) ;
    data.image = this.dbImage ;
    this.restApiService.put('images', data.id, data).subscribe(data => {
      this.toastrService.success('Success') ;
      this.closeModal = true ;
    }, error => {
      this.toastrService.error('Erreur lors de la Sauvegarde, Veuillez Ressayer !') ;
      console.log(error) ;
    }) ;
  }
}
