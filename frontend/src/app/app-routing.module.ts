import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanFormComponent } from './components/loan-form/loan-form.component';
import { LoanDetailComponent } from './components/loan-detail/loan-detail.component';

const routes: Routes = [
    { path: '', redirectTo: '/loans', pathMatch: 'full' },
    { path: 'loans', component: LoanListComponent },
    { path: 'loans/new', component: LoanFormComponent },
    { path: 'loans/:id', component: LoanDetailComponent },
    { path: '**', redirectTo: '/loans' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }