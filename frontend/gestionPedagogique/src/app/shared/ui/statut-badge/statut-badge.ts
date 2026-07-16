import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { resoudreStatut } from './statut.util';

@Component({
  selector: 'app-statut-badge',
  imports: [],
  templateUrl: './statut-badge.html',
  styleUrl: './statut-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatutBadge {
  readonly statut = input.required<string | null | undefined>();

  protected readonly affichage = computed(() => resoudreStatut(this.statut()));
}
