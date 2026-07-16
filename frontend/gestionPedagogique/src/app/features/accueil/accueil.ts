import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { Cursus } from '../../core/models/cursus.model';
import { FiliereService } from '../../core/services/filiere.service';
import { CursusService } from '../../core/services/cursus.service';
import { ApiError } from '../../core/http/api-error.model';
import { PromotionService } from '../promotions/promotion.service';

@Component({
  selector: 'app-accueil',
  imports: [RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly filiereService = inject(FiliereService);
  private readonly cursusService = inject(CursusService);
  private readonly promotionService = inject(PromotionService);

  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);
  protected readonly accesRefuse = signal(false);
  protected readonly stats = signal({ filieres: 0, cursus: 0, promotions: 0, sansCursus: 0 });
  protected readonly cursusRecents = signal<Cursus[]>([]);

  protected readonly nom = computed(() => {
    const email = this.auth.utilisateur()?.email ?? '';
    return email.split('@')[0].replace(/[._-]+/g, ' ') || 'bienvenue';
  });

  protected readonly peutGerer = computed(() => this.auth.aUnRole(['ROLE_ADMIN', 'ROLE_REFERENTE']));
  protected readonly estAdmin = computed(() => this.auth.aUnRole(['ROLE_ADMIN']));

  ngOnInit(): void {
    this.accesRefuse.set(this.route.snapshot.queryParamMap.get('acces') === 'refuse');
    this.charger();
  }

  private charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);

    forkJoin({
      filieres: this.filiereService.lister(),
      cursus: this.cursusService.lister(),
      promotions: this.promotionService.lister()
    }).subscribe({
      next: ({ filieres, cursus, promotions }) => {
        this.stats.set({
          filieres: filieres.length,
          cursus: cursus.length,
          promotions: promotions.length,
          sansCursus: filieres.filter((filiere) => filiere.nombreCursus === 0).length
        });
        this.cursusRecents.set(cursus.slice(0, 6));
      },
      error: (erreur: ApiError) => this.erreur.set(erreur.message),
      complete: () => this.chargement.set(false)
    });
  }
}
