import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface RegisterRequest {
  name: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7212/api/auth'; // Adjust to production URL if needed
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data)
      .pipe(catchError(this.handleError));
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data)
      .pipe(catchError(this.handleError));
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role ?? null;
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side/network error
      msg = `Client Error: ${error.error.message}`;
    } else {
      // Backend error
      if (error.status === 401) {
        msg = 'Unauthorized: Invalid credentials.';
      } else if (error.status === 400) {
        msg = 'Bad Request: Check submitted data.';
      } else {
        msg = `Server Error ${error.status}: ${error.message}`;
      }
    }

    console.error('AuthService Error:', msg);
    return throwError(() => msg);
  }
}

