import {ApplicationConfig, InjectionToken} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from "@angular/common/http";

import {routes} from './app.routes';
import {environment} from "../environments/environment";

export const APP_CONFIG = new InjectionToken('App Config');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), {
      provide: APP_CONFIG,
      useValue: environment,
    },
    provideHttpClient()
  ]
};
