import { routes } from './app.routes';
import { LoanListComponent } from './components/loan-list/loan-list.component';
import { LoanFormComponent } from './components/loan-form/loan-form.component';
import { LoanDetailComponent } from './components/loan-detail/loan-detail.component';

describe('App Routes', () => {
  it('should contain route to loan list', () => {
    expect(routes).toContain(
      jasmine.objectContaining({ path: 'loans', component: LoanListComponent })
    );
  });

  it('should contain route to create loan', () => {
    expect(routes).toContain(
      jasmine.objectContaining({ path: 'loans/new', component: LoanFormComponent })
    );
  });

  it('should contain route to loan details', () => {
    expect(routes).toContain(
      jasmine.objectContaining({ path: 'loans/:id', component: LoanDetailComponent })
    );
  });

  it('should redirect empty path to loans', () => {
    const redirectRoute = routes.find(route => route.path === '');
    expect(redirectRoute?.redirectTo).toBe('/loans');
    expect(redirectRoute?.pathMatch).toBe('full');
  });

  it('should redirect unknown routes to loans', () => {
    const wildcardRoute = routes.find(route => route.path === '**');
    expect(wildcardRoute?.redirectTo).toBe('/loans');
  });
});
