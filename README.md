## 🏗️ Arquitectura

El proyecto utiliza una **arquitectura en capas**, separando el acceso a datos, la lógica de negocio y la respuesta HTTP.

El flujo principal es:

```text
Cliente
   ↓
Routes
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
Model
   ↓
MongoDB
```

Para la respuesta al cliente se utiliza un DTO:

```text
MongoDB
   ↓
DAO
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
DTO
   ↓
Respuesta HTTP
```

### 📁 Responsabilidad de cada capa

#### Routes

Define las rutas disponibles de la API y los middlewares que deben ejecutarse antes del Controller.

Ejemplo:

```text
POST /api/tickets
GET /api/tickets/my
DELETE /api/tickets/:id
```

Las rutas no contienen lógica de negocio.

---

#### Controllers

Se encargan de recibir la petición HTTP y coordinar la respuesta.

Sus responsabilidades son:

* Obtener datos de `req.body`, `req.params` y `req.query`.
* Obtener el usuario autenticado desde `req.user`.
* Llamar al Service correspondiente.
* Devolver el código HTTP y la respuesta.
* Enviar los errores mediante `next(error)`.

El Controller **no accede directamente a MongoDB ni contiene reglas de negocio**.

```text
Controller → Service
```

---

#### Services

Contienen la **lógica de negocio** de la aplicación.

Por ejemplo, en Tickets:

* Verificar que la cantidad sea válida.
* Verificar que el evento exista.
* Verificar que el evento esté publicado.
* Calcular los cupos ocupados y disponibles.
* Evitar que un usuario tenga dos tickets activos para
