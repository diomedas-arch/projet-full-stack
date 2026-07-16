import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { StatutBadge } from '../../../shared/ui/statut-badge/statut-badge';
import { PromotionDetailData } from '../promotion.model';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-promotion-detail',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, StatutBadge],
  templateUrl: './promotion-detail.html',
  styleUrl: './promotion-detail.css',
})
export class PromotionDetail {
  readonly id = input<string>();

  private readonly promotionService = inject(PromotionService);
  protected readonly auth = inject(AuthService);

  protected readonly detail = signal<PromotionDetailData | null>(null);
  protected readonly chargement = signal(true);
  protected readonly introuvable = signal(false);
  protected readonly displayedColumns = ['ordre', 'cours', 'periode', 'salle', 'formateur', 'statut'];
  protected readonly peutGerer = () => this.auth.aUnRole(['ROLE_ADMIN', 'ROLE_REFERENTE']);

  constructor() {
    effect(() => {
      const idPromotion = this.id();
      if (!idPromotion) {
        return;
      }

      this.chargement.set(true);
      this.introuvable.set(false);

      this.promotionService.consulterDetail(Number(idPromotion)).subscribe({
        next: (detail) => this.detail.set(detail),
        error: () => {
          this.detail.set(null);
          this.introuvable.set(true);
          this.chargement.set(false);
        },
        complete: () => this.chargement.set(false)
      });
    });
  }
}
