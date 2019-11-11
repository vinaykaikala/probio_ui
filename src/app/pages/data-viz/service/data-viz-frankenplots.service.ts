import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataVizFrankenplotsService {

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

  public igvnavFileSave(data) {
    return this.http.post( this.api + '/flanken/save/igvinput', data)
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }
  public checkServerStatus() {
    return this.http.get( this.api + '/flanken/?project_name=PROBIO')
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }
  public getDropdownList(project_name) {
    return this.http.get( this.api + '/flanken/samples?project_name=' + project_name)
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }

  public getDropdownListCapture(project_name: string, sdid: string) {
    return this.http.get( this.api + '/flanken/capture?project_name=' + project_name + '&sdid=' + sdid)
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }

  public getFrankenPlots(analysis_id, plot_name) {
    return this.http.get( this.api + '/frankenplot/' + analysis_id + '/' + plot_name)
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }
  public getFrankenPlotUrl(project_name, sample_id, capture_id) {
    return this.http.get( this.api + '/flanken/ploturls?project_name=' + project_name + '&sdid=' + sample_id +
      '&capture_id=' + capture_id )
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }

  public getFrankenInterativePlot(project_name, sample_id, capture_id, plotname) {
    return this.http.get( this.api + '/flanken/plot?project_name=' + project_name + '&sdid=' +
      sample_id + '&capture_id=' + capture_id + '&pname=' + plotname)
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }
  public get_sv_table(project_name, sample_id, capture_id) {
    return this.http.get(this.api + '/flanken/table/svs?project_name=' + project_name + '&sdid=' + sample_id +
      '&capture_id=' + capture_id + '&header=true')
      .pipe(
        retry(0),
        catchError(this.handleError),
    );
  }

  public get_igv_table(variant_type, project_name, sample_id, capture_id) {
    return this.http.get(this.api + '/flanken/table/igv/' + variant_type + '?project_name=' + project_name +
      '&sdid=' + sample_id + '&capture_id=' + capture_id + '&header=true')
      .pipe(
        retry(0),
        catchError(this.handleError),
      );
  }

  public igv_status() {
    return this.http.get('http://127.0.0.1:60151/load?file=/nfs/PROBIO/for_igv/igv_test.xml&merge=false')
      .pipe(
        retry(1),
        catchError(this.handleError),
      );
  }

  public igv_locus_status(goto) {
    return this.http.get(goto)
      .pipe(
        retry(1),
        catchError(this.handleError),
      );
  }

  public igv_session_load(project_name, sample_id, capture_id, session_file) {
    return this.http.get('http://127.0.0.1:60151/load?file=/nfs/' + project_name + '/autoseq-output/' +
      sample_id + '/' + capture_id + '/IGVnav/' + session_file + '&merge=false')
      .pipe(
        retry(1),
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
