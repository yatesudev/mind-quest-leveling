import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CharacterService } from './character.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const characterService = inject(CharacterService);

  return authService.verifyToken().pipe(
    switchMap(response => {
      if (response.valid) {
        const userId = authService.getUserId();
        if (userId) {
          return characterService.checkUserHasCharacter(userId).pipe(
            map(characterResponse => {
              const isCharacterCreationRoute = state.url === '/character-creation';
              if (characterResponse.hasCharacter) {
                if (isCharacterCreationRoute) {
                  router.navigate(['/dashboard']);
                  return false;
                }
                return true;
              } else {
                if (isCharacterCreationRoute) {
                  return true;
                }
                router.navigate(['/character-creation']);
                return false;
              }
            })
          );
        } else {
          router.navigate(['/landingpage']);
          return of(false);
        }
      } else {
        router.navigate(['/landingpage']);
        return of(false);
      }
    }),
    catchError(() => {
      router.navigate(['/landingpage']);
      return of(false);
    })
  );
};
