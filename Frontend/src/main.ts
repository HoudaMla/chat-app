import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { SocketService } from './app/services/SocketService';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: 'APP_INITIALIZER',
      useFactory: (socketService: SocketService) => () => {
        socketService.initializeSocket();
        return Promise.resolve();
      },
      deps: [SocketService],
      multi: true
    }
  ]
}).catch(err => console.error(err));
