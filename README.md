# Click&Ready – Andes Market

Prototipo académico local, sin pagos reales, ERP, correos ni autenticación de servidor.

## Ejecutar
Abrir `index.html` en un navegador.

## Pruebas
Instalar Node.js 20 o superior y ejecutar `npm test`. Se usa el ejecutor nativo de Node.js, sin dependencias adicionales. Las pruebas verifican lógica observable del prototipo en un DOM simulado; **no son pruebas de navegador ni demuestran cobertura de 70 %**.

## CI/CD y entorno de demostración
1. Crear un repositorio de GitHub y subir **el contenido de esta carpeta a la raíz** del repositorio, incluida `.github/workflows/ci-pages.yml`.
2. En **Settings > Pages > Build and deployment**, seleccionar **GitHub Actions**.
3. En **Actions**, revisar el flujo `Pruebas y despliegue de demostración`. Solo publica si pasan las pruebas.
4. Revisar el enlace del despliegue en **Settings > Pages** o en el entorno `github-pages` del workflow.
5. Para revisión por pares, abrir un Pull Request desde otra rama y solicitar revisión a un compañero. No marcarlo como aprobado sin aprobación real.

GitHub Pages se utiliza como entorno de demostración académico; no constituye un staging productivo aislado. No subir credenciales ni datos reales.
