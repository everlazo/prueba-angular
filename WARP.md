# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: Angular 20 standalone app for listing cards from a public API. Package manager: npm (package-lock.json present).

Prerequisites
- Node.js >= 22.12
- npm >= 10

Common commands
- Install dependencies (CI-friendly):
  - npm ci
  - or locally: npm install
- Start dev server (http://localhost:4200):
  - npm start
  - or ng serve
- Build (default configuration: production):
  - npm run build
  - Dev watch build: npm run watch  (equivalent to ng build --watch --configuration development)
- Run unit tests (Karma + Jasmine):
  - npm test
  - or ng test
  - With coverage: ng test --code-coverage
  - Run a single spec file: ng test --include src/app/services/cards.spec.ts
  - Non-watch (one-off): ng test --watch=false
  - Focus a single test inside a spec: use fit(...) or fdescribe(...) in the Jasmine spec (remember to revert).

Repository structure and architecture
- Angular style: Standalone components and providers (no NgModules). Signals are used for local state in components.
- Entry and bootstrap
  - src/main.ts bootstraps App using appConfig.
  - src/app/app.ts is the root standalone component with template src/app/app.html and styles src/app/app.scss.
  - Global providers defined in src/app/app.config.ts:
    - provideRouter(routes) with routes from src/app/app.routes.ts
    - provideHttpClient(withFetch()) for HTTP
    - provideZoneChangeDetection({ eventCoalescing: true }) and provideBrowserGlobalErrorListeners()
- Routing
  - src/app/app.routes.ts maps '' to CardsList and redirects all unknown routes to ''.
- Feature components
  - src/app/components/cards-list/CardsList
    - State: three Angular signals loading, error, cards.
    - On construction, subscribes to CardsService.getCards(), toggles loading via finalize, and sets error signal on failure.
    - Template uses Angular control flow (@if, @for) to render loading/error states and a responsive grid of cards.
    - SCSS defines responsive grid and basic card styling.
- Services and data flow
  - src/app/services/cards.ts defines CardsService and types.
  - External API endpoint: https://62e152f8fa99731d75d44571.mockapi.io/api/v1/test-front-end-skandia/cards
  - getCards(): HttpClient GET -> maps { listCard } to Card[]; propagates user-friendly error via throwError on failure.
- Assets and styles
  - Global styles in src/styles.scss; Angular builder includes assets from public/.
- Testing
  - Framework: Karma + Jasmine via @angular/build:karma.
  - Example service tests use HttpClientTestingModule (provideHttpClientTesting) with HttpTestingController. See src/app/services/cards.spec.ts.

Tooling notes
- Linting: No ESLint configuration or lint script is present in this repo.
- Formatting: Prettier settings are embedded in package.json (HTML uses parser: angular).

Angular CLI builder configuration (angular.json) highlights
- Build: @angular/build:application with defaultConfiguration: production. Development config enables source maps and disables optimization.
- Serve: @angular/build:dev-server; default configuration is development.
- Test: @angular/build:karma with zone.js and zone.js/testing polyfills; uses tsconfig.spec.json.
