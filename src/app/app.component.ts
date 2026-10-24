import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { faqs, services, type CustomerType, type EnergyService } from './data/content';
import { encodeAnalysisRequest, sendAnalysisRequest } from './services/contact';
import { ScrollRevealDirective } from './shared/scroll-reveal.directive';

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'se-root',
  standalone: true,
  imports: [ReactiveFormsModule, ScrollRevealDirective],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly services = services;
  readonly faqs = faqs;
  readonly year = new Date().getFullYear();
  readonly menuOpen = signal(false);
  readonly expandedFaq = signal<number | null>(0);
  readonly expandedService = signal<string | null>(null);
  readonly submission = signal<SubmitState>('idle');
  readonly submissionMessage = computed(() => this.submission() === 'success'
    ? 'Obrigado. O seu pedido foi enviado e será analisado pela equipa.'
    : this.submission() === 'error'
      ? 'Não foi possível enviar o pedido. Confirme a ligação e tente novamente.'
      : '');

  readonly form = new FormBuilder().nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    customerType: ['Particular', Validators.required],
    energyType: ['Eletricidade', Validators.required],
    contactPreference: ['Email', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
    consent: [false, Validators.requiredTrue],
    'bot-field': [''],
  });

  constructor() {
    this.form.controls.contactPreference.valueChanges.subscribe(preference => {
      const phone = this.form.controls.phone;
      phone.setValidators(preference === 'Telefone' ? [Validators.required] : []);
      phone.updateValueAndValidity({ emitEvent: false });
    });
  }

  closeMenu(): void { this.menuOpen.set(false); }
  toggleFaq(index: number): void { this.expandedFaq.update(previous => previous === index ? null : index); }
  toggleService(id: string): void { this.expandedService.update(previous => previous === id ? null : id); }

  startAnalysis(type?: CustomerType, subject?: EnergyService): void {
    if (type) this.form.controls.customerType.setValue(type);
    if (subject) this.form.controls.message.setValue(`Gostaria de saber mais sobre ${subject.title.toLowerCase()}.`);
    this.submission.set('idle');
    this.closeMenu();
    document.getElementById('pedir-analise')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  async submit(): Promise<void> {
    if (this.submission() === 'sending') return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.controls['bot-field'].value) return;
    this.submission.set('sending');
    try {
      await sendAnalysisRequest(encodeAnalysisRequest(this.form.getRawValue()));
      this.submission.set('success');
      this.form.reset({ name: '', email: '', phone: '', customerType: 'Particular', energyType: 'Eletricidade', contactPreference: 'Email', message: '', consent: false, 'bot-field': '' });
    } catch {
      this.submission.set('error');
    }
  }
}
