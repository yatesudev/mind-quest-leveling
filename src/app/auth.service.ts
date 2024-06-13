import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private apiUrl = 'http://localhost:3000/auth';
  private apiUrl = 'http://[2a02:908:2010:1d40:ca72:b46c:fc44:59b7]:3000/auth';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  verifyToken(): Observable<any> {
    const token = this.getToken();
    return this.http.post<any>(`${this.apiUrl}/verify-token`, { token });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /*
  logout() {
    localStorage.removeItem('token');
  }*/

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.id;
    }
    return null;
  }
}