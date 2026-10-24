import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

/** Reveals an element once when it enters the viewport. No-JS and reduced-motion stay visible. */
@Directive({
  selector: '[seReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    // Only hide elements when an observer can immediately take responsibility for showing them.
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.element.classList.add('is-visible');
          this.observer?.unobserve(this.element);
        }
      }
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0.05 });

    this.element.classList.add('se-reveal');
    this.observer.observe(this.element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
