import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavHeaderComponent } from './nav-header.component';

describe('NavHeaderComponent', () => {
  let component: NavHeaderComponent;
  let fixture: ComponentFixture<NavHeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        NavHeaderComponent
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have brand link that navigates to home', () => {
    const brandLink = fixture.debugElement.query(By.css('.brand'));
    expect(brandLink).toBeTruthy();
    
    const routerLink = brandLink.attributes['routerLink'];
    expect(routerLink).toBe('/');
    
    const brandText = brandLink.nativeElement.textContent;
    expect(brandText).toContain('Loan Management');
  });

  it('should have View Loans navigation link', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('.nav-items a'));
    const viewLoansLink = navLinks.find(link => link.nativeElement.textContent.includes('View Loans'));
    
    expect(viewLoansLink).toBeTruthy();
    expect(viewLoansLink?.attributes['routerLink']).toBe('/loans');
  });

  it('should have active class when route is active', () => {
    // We need to simulate router state
    const routerLinks = fixture.debugElement.queryAll(By.css('a[routerLink]'));
    expect(routerLinks.length).toBeGreaterThan(0);
    
    // Check that routerLinkActive directive is present
    const hasActiveClass = routerLinks.some(link => 
      link.attributes['routerLinkActive'] === 'active');
    
    expect(hasActiveClass).toBeTruthy();
  });
});
