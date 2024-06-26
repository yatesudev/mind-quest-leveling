import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CharacterService } from './character.service';

// Authentication guard to protect routes
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router); // Inject Router
  const characterService = inject(CharacterService); // Inject CharacterService

  // Verify token validity
  return authService.verifyToken().pipe(
    switchMap((response) => {
      if (response.valid) {
        const userId = authService.getUserId();
        if (userId) {
          // Check if user has a character
          return characterService.checkUserHasCharacter(userId).pipe(
            map((characterResponse) => {
              const isCharacterCreationRoute = state.url === '/character-creation';
              if (characterResponse.hasCharacter) {
                if (isCharacterCreationRoute) {
                  router.navigate(['/dashboard']); // Redirect to dashboard if user has a character
                  return false;
                }
                return true; // Allow route access
              } else {
                if (isCharacterCreationRoute) {
                  return true; // Allow access to character creation
                }
                router.navigate(['/character-creation']); // Redirect to character creation
                return false;
              }
            })
          );
        } else {
          router.navigate(['/landingpage']); // Redirect to landing page if user ID not found
          return of(false);
        }
      } else {
        router.navigate(['/landingpage']); // Redirect to landing page if token is invalid
        return of(false);
      }
    }),
    catchError(() => {
      router.navigate(['/landingpage']); // Redirect to landing page on error
      return of(false);
    })
  );
};