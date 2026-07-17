import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { authGuard } from './auth.guard';

const CLE_TOKEN = 'gestion-pedagogique.auth-token';

function construireFauxJwt(role: string): string {
  const payload = btoa(JSON.stringify({ role }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `header.${payload}.signature`;
}

@Component({ selector: 'app-liste-factice', template: 'liste' })
class ListeFactice {}

@Component({ selector: 'app-formulaire-factice', template: 'formulaire' })
class FormulaireFactice {}

@Component({ selector: 'app-login-factice', template: 'login' })
class LoginFactice {}

describe('authGuard (vérification de rôle sur route)', () => {
  afterEach(() => {
    localStorage.removeItem(CLE_TOKEN);
  });

  async function configurer(): Promise<void> {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [
            { path: 'login', component: LoginFactice },
            { path: 'cours', canActivate: [authGuard], component: ListeFactice },
            {
              path: 'cours/nouveau',
              canActivate: [authGuard],
              data: { roles: ['ROLE_REFERENTE'] },
              component: FormulaireFactice
            }
          ],
          withComponentInputBinding()
        )
      ]
    }).compileComponents();
  }

  it("redirige vers la liste (et n'active pas le formulaire) si le rôle ne correspond pas", async () => {
    localStorage.setItem(CLE_TOKEN, construireFauxJwt('ROLE_ELEVE'));
    await configurer();

    const harness = await RouterTestingHarness.create('/cours/nouveau');

    expect(harness.routeDebugElement?.componentInstance instanceof FormulaireFactice).toBeFalse();
    expect(TestBed.inject(Router).url).toBe('/cours');
  });

  it('laisse passer vers le formulaire si le rôle correspond (ROLE_REFERENTE)', async () => {
    localStorage.setItem(CLE_TOKEN, construireFauxJwt('ROLE_REFERENTE'));
    await configurer();

    const harness = await RouterTestingHarness.create('/cours/nouveau');

    expect(harness.routeDebugElement?.componentInstance instanceof FormulaireFactice).toBeTrue();
  });

  it("redirige vers /login si l'utilisateur n'est pas connecté du tout", async () => {
    await configurer();

    await RouterTestingHarness.create('/cours/nouveau');

    expect(TestBed.inject(Router).url).toBe('/login');
  });
});
