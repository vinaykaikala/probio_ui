import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReferralDBService {

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // define your api url
  api = '/api';
  // HttpClient API get() method => Fetch all alassca completed jobs.

  public get_referral_data(proj_name) {
    return this.http.get( this.api + '/referral/' + proj_name)
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }

  public update_referral_data(db_name) {
    return this.http.get( this.api + '/referral/update?db_name=' + db_name )
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }

// Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
// Get client-side error
      errorMessage = error.error.message;
    } else {
// Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
