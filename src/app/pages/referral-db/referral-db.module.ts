import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { ReferralDBRoutingModule, routedComponents} from './referral-db-routing.module';
import {NbDialogModule} from '@nebular/theme';


// For Referral Table
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableModule } from 'ngx-easy-table';

@NgModule({
  declarations: [
    ...routedComponents,
  ],
  imports: [
    ReferralDBRoutingModule,
    CommonModule,
    ThemeModule,
    NbDialogModule.forChild(),
    Ng2SmartTableModule,
    TableModule,
  ],
})
export class ReferralDBModule { }
