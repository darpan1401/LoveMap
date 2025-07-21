import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public notifications$ = new BehaviorSubject<any[]>([]);

  constructor() {
    this.initOneSignal();
  }

  private initOneSignal() {
    const oneSignal = (window as any).OneSignal;
    if (oneSignal) {
      oneSignal.on('notificationDisplay', (event: any) => {
        this.notifications$.next([...this.notifications$.value, event]);
      });
    }
  }

  public dismissNotification(id: string) {
    const filtered = this.notifications$.value.filter(n => n.id !== id);
    this.notifications$.next(filtered);
  }
}