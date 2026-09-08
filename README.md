## 📅 Eventos

La entidad `Event` permite administrar los eventos de la aplicación mediante un CRUD, aplicando autenticación, autorización por roles y reglas de negocio.

### Rutas de eventos

| Método   | Ruta               | Descripción              | Acceso                            |
| -------- | ------------------ | ------------------------ | --------------------------------- |
| `GET`    | `/api/events`      | Lista eventos            | Público / autenticado             |
| `GET`    | `/api/events/:eid` | Obtiene un evento por ID | Público / autenticado             |
| `POST`   | `/api/events`      | Crea un evento           | `organizer`, `admin`              |
| `PUT`    | `/api/events/:eid` | Modifica un evento       | Propietario `organizer` o `admin` |
| `DELETE` | `/api/events/:eid` | Elimina un evento        | Propietario `organizer` o `admin` |

### Crear evento

`POST /api/events`

Requiere una sesión autenticada y uno de los siguientes roles:

* `organizer`
* `admin`

El usuario `user` recibe **403 Forbidden**.

El evento debe contener los campos obligatorios definidos por el modelo.

Ejemplo:

```json
{
  "title": "Torneo de fútbol",
  "description": "Torneo amateur",
  "date": "2026-10-15",
  "location": "Buenos Aires",
  "capacity": 50
}
```

### Obtener eventos

`GET /api/events`

Permite obtener un listado de eventos.

La ruta admite filtros, paginación y ordenamiento mediante query parameters.

Ejemplo:

```text
GET /api/events?category=deportes&page=1&limit=10&sort=asc
```

### Filtros disponibles

Los filtros dependen de los campos definidos en la entidad `Event`.

Ejemplos:

| Parámetro  | Descripción          |
| ---------- | -------------------- |
| `category` | Filtra por categoría |
| `location` | Filtra por ubicación |
| `date`     | Filtra por fecha     |
| `status`   | Filtra por estado    |

Los filtros pueden combinarse en una misma solicitud.

### Paginación

El listado permite controlar la cantidad de resultados y la página solicitada:

```text
GET /api/events?page=1&limit=10
```

* `page`: número de página.
* `limit`: cantidad de eventos por página.

### Ordenamiento

El listado permite ordenar los resultados mediante un parámetro de ordenamiento.

Ejemplo:

```text
GET /api/events?sort=asc
```

o:

```text
GET /api/events?sort=desc
```

El criterio concreto de ordenamiento debe corresponder al campo definido por la implementación, por ejemplo fecha de creación o fecha del evento.

---

## 👥 Roles requeridos

### `user`

Puede consultar eventos, pero no puede crear, modificar ni eliminar eventos que requieran permisos de organización.

Si intenta acceder a una ruta exclusiva de `organizer` o `admin`, recibe:

```text
403 Forbidden
```

### `organizer`

Puede crear eventos y administrar aquellos recursos de los que sea propietario, según las reglas de negocio de la aplicación.

### `admin`

Tiene permisos administrativos y puede gestionar eventos independientemente de su propietario, según las reglas definidas por la aplicación.

---

## 📋 Reglas de negocio principales

La creación y modificación de eventos debe respetar las validaciones definidas por la aplicación.

Entre las reglas principales se encuentran:

* El usuario debe estar autenticado para realizar operaciones protegidas.
* Solo `organizer` y `admin` pueden crear eventos.
* Un `organizer` solo puede modificar o eliminar eventos de los que sea propietario.
* Un `admin` puede administrar los eventos sin restricciones de propiedad.
* Los campos obligatorios del evento deben estar presentes.
* Los valores recibidos deben respetar los tipos y restricciones definidos por el modelo.
* Un evento debe tener una fecha válida.
* No se deben permitir valores inválidos para campos que tengan restricciones específicas.
* Las operaciones sobre eventos inexistentes deben devolver un error apropiado, por ejemplo `404 Not Found`.

### Autenticación y autorización

Las rutas protegidas siguen el siguiente flujo:

```text
Request
   ↓
JWT / Passport
   ↓
¿Sesión válida?
   ├── NO → 401
   ↓
¿Rol permitido?
   ├── NO → 403
   ↓
¿Es propietario?*
   ├── NO → 403
   ↓
Controller
   ↓
Lógica de negocio
```

`*` La comprobación de propiedad aplica a las operaciones donde corresponda.
