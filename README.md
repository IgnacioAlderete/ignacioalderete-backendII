La matriz debe mantenerse actualizada de acuerdo con los permisos implementados en los middlewares y las rutas de la aplicación.

Rutas de sesiones
Registro

POST /api/sessions/register

Permite registrar un nuevo usuario.

Acceso: público.

Login

POST /api/sessions/login

Permite iniciar sesión y generar la sesión autenticada mediante JWT.

Acceso: público.

Sesión actual

GET /api/sessions/current

Ruta protegida. Verifica la cookie con el JWT y devuelve los datos básicos del usuario autenticado:

{
  "id": "...",
  "email": "usuario@email.com",
  "role": "user"
}

No se devuelve la contraseña del usuario.

Acceso: usuarios autenticados.

Logout

POST /api/sessions/logout

Cierra la sesión eliminando/inutilizando la cookie de autenticación.

Acceso: usuarios autenticados.

Las rutas que requieren autenticación utilizan un middleware auth.

El middleware:

Obtiene el JWT desde la cookie.
Verifica que el token sea válido y no esté expirado.
Obtiene la información del usuario.
Guarda el payload en req.user.
Permite continuar con la ejecución de la ruta.

Si el usuario no tiene una sesión válida, la solicitud es rechazada.

Las rutas que además requieren un rol específico utilizan un middleware de autorización.

Por ejemplo:

auth → verifica que exista una sesión
role → verifica que el usuario tenga el permiso necesario
controller → ejecuta la operación