import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SheetyService {
  private sheetyUrl = 'https://api.sheety.co/65cab4503829bb9a5ac0b4513477b06c/loveMap/sheet1';
  private bearerToken = 'lovemapxyzabc123';

  constructor(private http: HttpClient) {}

  async checkProfileExists(email: string): Promise<boolean> {
  if (!email) {
    console.warn('No email provided for profile check');
    return false;
  }

  try {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json'
    });

    // Fetch ALL data (no filter)
    const response = await firstValueFrom(
      this.http.get<any>(this.sheetyUrl, { headers })
    );

    console.log('Sheety API response:', response);

    // Check if ANY profile has the exact email (case-insensitive)
    const profileExists = response.sheet1.some(
      (profile: any) => profile.email?.toLowerCase() === email.toLowerCase()
    );

    console.log(`Exact match for ${email}:`, profileExists);
    return profileExists;

  } catch (error) {
    console.error('Error checking profile:', error);
    return false;
  }
}
  postUserData(data: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json'
    });

    const body = { sheet1: data };
    return this.http.post(this.sheetyUrl, body, { headers });
  }
}