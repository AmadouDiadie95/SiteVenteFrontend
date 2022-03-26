import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {dateComparator} from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-tools";
import {formatDate} from "@angular/common";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class TestDayGuard implements CanActivate {
  constructor(private router: Router, private toastrService: ToastrService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let testDate = formatDate(new Date('2022-04-01'),'yyyy-MM-dd', 'en_US') ;
    let today = formatDate(new Date(),'yyyy-MM-dd', 'en_US') ;
    console.log(testDate) ;
    console.log(today) ;
    if (today > testDate) {
      this.toastrService.warning('Forbidden !') ;
      this.router.navigateByUrl('home') ;
      return false ;
    } else {
      return true ;
    }
  }
  
}
