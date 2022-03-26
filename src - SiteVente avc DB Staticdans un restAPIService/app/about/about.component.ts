import { Component, OnInit } from '@angular/core';
import {catchError, map, startWith} from "rxjs/operators";
import {AppDataState, DataStateEnum} from "../state/product.state";
import {RestApiService} from "../services/rest-api.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {Observable, of} from "rxjs";
import {ImageModel} from "../models/image.model";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  imageToChange$: Observable<AppDataState<any[]>> | null = null ;
  banner: ImageModel = new ImageModel() ;
  bannerWWA: ImageModel = new ImageModel() ;
  bannerTeam1: ImageModel = new ImageModel() ;
  bannerTeam2: ImageModel = new ImageModel() ;
  bannerTeam3: ImageModel = new ImageModel() ;
  DataStateEnum=DataStateEnum;
  closeModal?: boolean ;
  uploadedImage: any ;
  httpResponse: any;
  dbImage: any;
  isAuthenticated = localStorage.getItem('authenticated');
  allImages: Array<ImageModel> = this.restApiService.allImages ;

  constructor(private restApiService: RestApiService,
              private router: Router,private modalService: NgbModal,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    // this.initAllImage() ;
    this.initAllImage2() ;
  }

  initAllImage2(){
    this.allImages.forEach(image => {
      if (image.identifier == 'about-banner') {
        this.banner = image ;
      }
      if (image.identifier == 'who-we-are-banner') {
        this.bannerWWA = image ;
      }
      if (image.identifier == 'team-1-banner') {
        this.bannerTeam1 = image ;
      }
      if (image.identifier == 'team-2-banner') {
        this.bannerTeam2 = image ;
      }
      if (image.identifier == 'team-3-banner') {
        this.bannerTeam3 = image ;
      }
    }) ;
  }

  initAllImage() {
    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'about-banner').subscribe(data => {
      this.httpResponse = data;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true;
          this.banner = this.httpResponse ;
          this.httpResponse = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !');
      console.log(error);
    });

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'who-we-are-banner').subscribe(data => {
      this.httpResponse = data;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true;
          this.bannerWWA = this.httpResponse ;
          this.httpResponse = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !');
      console.log(error);
    });

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'team-1-banner').subscribe(data => {
      this.httpResponse = data;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true;
          this.bannerTeam1 = this.httpResponse ;
          this.httpResponse = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !');
      console.log(error);
    });

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'team-2-banner').subscribe(data => {
      this.httpResponse = data;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true;
          this.bannerTeam2 = this.httpResponse ;
          this.httpResponse = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !');
      console.log(error);
    });

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'team-3-banner').subscribe(data => {
      this.httpResponse = data;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true;
          this.bannerTeam3 = this.httpResponse ;
          this.httpResponse = null ;
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
