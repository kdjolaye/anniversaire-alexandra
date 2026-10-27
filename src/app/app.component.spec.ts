import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
  });

  it('creates the birthday experience', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.birthday.name).toBe('Alexandra');
  });

  it('opens the birthday page from the introduction', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.button-primary') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#accueil h1')?.textContent).toContain('Alexandra');
  });
});
