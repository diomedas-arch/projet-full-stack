import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { RoleUtilisateur, libelleRole } from './core/auth/auth.model';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly menuOuvert = signal(false);
  private readonly urlCourante = signal(this.router.url);

  private readonly tousLesLiens: { path: string; label: string; icon: string; roles?: RoleUtilisateur[] }[] = [
    { path: '/accueil', label: 'Accueil', icon: 'A' },
    { path: '/promotions', label: 'Promotions', icon: 'P' },
    { path: '/mon-calendrier', label: 'Mon calendrier', icon: 'M', roles: ['ROLE_ELEVE'] },
    { path: '/mes-cours', label: 'Mes cours', icon: 'F', roles: ['ROLE_FORMATEUR'] },
    { path: '/filieres', label: 'Filières', icon: 'F', roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    { path: '/cursus', label: 'Cursus', icon: 'C', roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    { path: '/cours', label: 'Cours', icon: 'C', roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    { path: '/cours-planifies', label: 'Cours planifiés', icon: 'P', roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    { path: '/eleves', label: 'Élèves', icon: 'E', roles: ['ROLE_ADMIN', 'ROLE_REFERENTE'] },
    { path: '/utilisateurs', label: 'Utilisateurs', icon: 'U', roles: ['ROLE_ADMIN'] }
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.urlCourante.set(event.urlAfterRedirects);
        this.menuOuvert.set(false);
      });
  }

  protected readonly afficherShell = computed(() => this.auth.estConnecte() && !this.urlCourante().startsWith('/login'));

  protected readonly liens = computed(() => {
    const role = this.auth.role();
    return this.tousLesLiens.filter((lien) => !lien.roles?.length || (role && lien.roles.includes(role)));
  });

  protected readonly initiale = computed(() => this.auth.utilisateur()?.email.charAt(0).toUpperCase() ?? 'U');
  protected readonly roleLibelle = computed(() => libelleRole(this.auth.role()));

  protected ouvrirMenu(): void {
    this.menuOuvert.set(true);
  }

  protected fermerMenu(): void {
    this.menuOuvert.set(false);
  }

  protected deconnecter(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:keydown.escape')
  protected fermerMenuClavier(): void {
    this.fermerMenu();
  }
}
