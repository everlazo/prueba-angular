# Prueba técnica Front End – Angular

Objetivo: Evidenciar habilidades en desarrollo y maquetación Web aplicando buenas prácticas con HTML5, CSS/SCSS, TypeScript y Angular (última versión estable).

En esta app se consume la API pública para listar tarjetas y se maqueta una vista responsive basada en el diseño provisto.

- Diseño: https://xd.adobe.com/view/7520751b-2b53-4b0f-9613-527817e8cc92-2073/specs/
- API tarjetas: https://62e152f8fa99731d75d44571.mockapi.io/api/v1/test-front-end-skandia/cards

## Requisitos previos
- Node.js >= 22.12 (LTS recomendado)
- npm >= 10

## Configuración y ejecución
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar el servidor de desarrollo:
   ```bash
   npm start
   # ó
   ng serve
   ```
3. Abrir http://localhost:4200

## Estructura relevante
- src/app/services/cards.ts → Servicio para consumo de API (tipado, manejo de errores)
- src/app/components/cards-list → Componente para renderizar tarjetas, estados de carga y error
- src/app/app.routes.ts → Rutas ('' → CardsList)
- src/app/app.config.ts → Providers globales (HttpClient)

## Pruebas unitarias
Ejecutar pruebas (Karma/Jasmine):
```bash
npm test
# ó
ng test
```
Incluye pruebas del servicio con HttpClientTestingModule (caso exitoso y manejo de error).

## Construcción
```bash
npm run build
# ó
ng build
```
El build queda en dist/.

## Notas de implementación
- Angular standalone, providers en app.config.ts
- Estilos en SCSS con layout responsive (grid) sin dependencias de UI externas (se pueden incorporar si se requiere)
- Código tipado y organizado por features (components) y servicios

## Entrega
Subir este repositorio a la plataforma de tu preferencia y compartir el enlace. Agregar cualquier instrucción adicional si aplica.
