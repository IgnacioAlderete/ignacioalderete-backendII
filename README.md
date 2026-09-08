Flujo general de una inscripción
Usuario autenticado
        ↓
POST /api/events/:eid/tickets
        ↓
Verificar evento
        ↓
Verificar estado "published"
        ↓
Validar quantity
        ↓
Calcular cupos disponibles
        ↓
Verificar que no exista ticket activo
        ↓
Crear Ticket
        ↓
MongoDB
        ↓
Respuesta al usuario
Flujo de cancelación
Usuario autenticado
        ↓
PATCH /api/tickets/:tid/cancel
        ↓
Buscar Ticket
        ↓
Verificar que exista
        ↓
Verificar que no esté cancelado
        ↓
Verificar propietario o Admin
        ↓
status = "cancelled"
        ↓
cancelledAt = fecha actual
        ↓

Guardar cambios