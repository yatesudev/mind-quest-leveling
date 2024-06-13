// character.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
    //private apiUrl = 'http://localhost:3000/auth';
    private apiUrl = 'http://[2a02:908:2010:1d40:ca72:b46c:fc44:59b7]:3000/auth';

  constructor(private http: HttpClient) {}

  assignClassToUser(userId: string, characterClass: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign-class`, { userId, characterClass });
  }

  checkUserHasCharacter(userId: string): Observable<{ hasCharacter: boolean }> {
    return this.http.get<{ hasCharacter: boolean }>(`${this.apiUrl}/has-character/${userId}`);
  }
}
