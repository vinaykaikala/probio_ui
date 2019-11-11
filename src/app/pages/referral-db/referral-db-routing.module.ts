import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferralDBComponent} from './referral-db.component';
import { ReferraldbtableComponent} from './referraldbtable/referraldbtable.component';

const routes: Routes = [{
  path: ':project',
  component: ReferraldbtableComponent,
},
{    path: '',
  redirectTo: 'probio',
  pathMatch: 'full',
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferralDBRoutingModule {}

export const routedComponents = [
  ReferralDBComponent,
  ReferraldbtableComponent,
];


