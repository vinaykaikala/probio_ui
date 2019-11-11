import { Component, OnInit, TemplateRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// import { DataVizFrankenplotsService} from '../service/data-viz-frankenplots.service';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { ReferralDBService } from '../service/referral-db.service';
import { ActivatedRoute } from '@angular/router';

// table  modules
import { LocalDataSource } from 'ng2-smart-table';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ConfigurationService } from '../service/table_config-service';
import {ConfigurationServiceNoRowGroup} from '../service/table_config_no_row_group-service';

@Component({
  selector: 'ngx-referraldbtable',
  templateUrl: './referraldbtable.component.html',
  styleUrls: ['./referraldbtable.component.scss'],
})
export class ReferraldbtableComponent implements OnInit, AfterViewInit {

  public referal_update_status = false;
  /* ngx easy table data*/
  public configuration: Config = ConfigurationService.config;
  public configuration_no_row_group: Config  = ConfigurationServiceNoRowGroup.config2;
  public columns: Columns[] = [ ];
  public ngx_data = [ ];
  public project_name = '';
  public group_by = 'None';
  public toggleRowIndex;

  // action button edit
  @ViewChild('actionTpl') actionTpl: TemplateRef<any>;
  @ViewChild('gtag') gtag: ElementRef<any>;

  constructor(private referral_service: ReferralDBService,
              private  route: ActivatedRoute,
              private toastrService: NbToastrService,
              private dialogService: NbDialogService) { }

  ngAfterViewInit() {
  }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get('project'));
    this.route.params.subscribe(routeParams => {
      // this.showToast(NbToastStatus.SUCCESS, 'PROBIO: ',
      //  'Referral DB component is ready' + routeParams.project);
      this.project_name = routeParams.project;
      this.loadTable(routeParams.project);
    });
  }

  public loadTable(projectName) {
    this.ngx_data = [];
    this.columns = [];
    this.referral_service.get_referral_data(projectName).subscribe(
      data => {
         this.showToast(NbToastStatus.SUCCESS, 'PROBIO: ',
         'Referral DB component is ready' + projectName);
         this.columns = data['header'];
         this.ngx_data = data['data'];
         this.group_by = 'None';
      },
        error => {
          this.showToast(NbToastStatus.DANGER, 'PROBIO: ',
           'Unable to data from Referral DB for ' + projectName );
    });
  }

  onChange(groupBy: string): void {
    this.group_by = groupBy;
  }

  onRowClickEvent($event, index: number): void {
    $event.preventDefault();
    this.toggleRowIndex = { index };
  }
  toggle( index: number): void {
    this.toggleRowIndex = { index };
  }
  private showToast(type: NbToastStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 12000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: true,
    };
    const titleContent = title ? `. ${title}` : '';
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

  update_referraldb() {

    this.referal_update_status = true;
    this.referral_service.update_referral_data(this.project_name).subscribe(
      data => {
        this.showToast(NbToastStatus.SUCCESS, 'PRO-VIZ: ',
          'Referral DB  for ' + this.project_name + ' updated');
        this.referal_update_status = false;
      },
        error => {
          this.referal_update_status = false;
          this.showToast(NbToastStatus.DANGER, 'PRO-VIZ: ',
            'Failed to update referral db erroe:' + error);
        });
  }

  refresh_table() {
    this.loadTable(this.project_name);
  }


}
