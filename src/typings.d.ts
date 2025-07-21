interface Window {
  OneSignal?: {
    init(config: any): Promise<void>;
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
    push(callback: (OneSignal: any) => void): void;
    Notifications: {
      create(options: any): void;
    };
    Session: {
      setAppId(appId: string): Promise<void>;
    };
    showSlidedownPrompt(options?: any): Promise<void>;
  };
  OneSignalDeferred?: any[];
}

interface OneSignalNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  data?: any;
}