# Staging y rollback del blog

## Frontera

`main` es la única rama de producción; Vercel la despliega automáticamente. `staging` produce un Preview aislado. Ningún ensayo usa tokens de Vercel ni altera la URL pública.

## Previsualización

1. Crear/actualizar `staging` desde `main` y llevar ahí el cambio.
2. Esperar el deployment Preview de Vercel asociado al commit de `staging`.
3. Verificar los bytes del Preview, sustituyendo la URL real:

   ```bash
   ./scripts/verify-preview.sh https://<preview>.vercel.app
   ```

4. Solo después de la revisión visual, fusionar a `main`. La verificación de producción existente espera el SHA correcto de Vercel y ejecuta `verify-prod.sh` contra la URL pública.

## Ensayo de fallo

El ensayo se hace únicamente en `staging`: introducir una violación temporal que falle `npm run build`, confirmar que GitHub Actions queda rojo, y revertirla antes de abrir la fusión. La evidencia a guardar es el enlace a ese run fallido y el run verde de recuperación. Nunca se empuja un build roto a `main`.

## Rollback

Producción se revierte con una nueva historia, nunca con `push --force`:

```bash
git revert <sha-del-release>
git push origin main
```

Al terminar el nuevo deploy, `verify-production.yml` debe confirmar que `origin/main`, el deployment de Vercel y el canonical público apuntan al mismo commit. Si esa comparación falla, el rollback no se declara cerrado.
