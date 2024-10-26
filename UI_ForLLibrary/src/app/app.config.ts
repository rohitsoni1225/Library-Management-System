import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
     provideAnimationsAsync(),
      provideHttpClient(),
      importProvidersFrom(
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return localStorage.getItem('access_token');
            },
            allowedDomains: ['localhost:44348'],
          },
        })),
        provideHttpClient(withInterceptorsFromDi()),
      ]
};
