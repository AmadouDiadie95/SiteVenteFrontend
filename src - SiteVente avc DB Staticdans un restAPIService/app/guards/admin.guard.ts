import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private toastrService: ToastrService, private router: Router) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let authenticated = localStorage.getItem('authenticated') ;

    if (authenticated == null) {
      this.toastrService.info('Veuillez Vous Authentifier !') ;
      this.router.navigateByUrl('home') ;
      return false ;
    } else {
      return true ;
    }

  }
  
}
