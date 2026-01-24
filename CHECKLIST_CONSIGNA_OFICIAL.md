# CHECKLIST DE CUMPLIMIENTO - Entrega N°1
## Basado en la Consigna Oficial

---

## 1. MODELO DE USUARIO

**Archivo:** `src/dao/models/user.model.js`

### Campos Requeridos:
- ✅ **first_name: String** - Implementado (línea 7-10)
- ✅ **last_name: String** - Implementado (línea 11-14)
- ✅ **email: String (único)** - Implementado con `unique: true` (línea 15-19)
- ✅ **age: Number** - Implementado (línea 24-27)
- ✅ **password: String (en formato hash)** - Implementado (línea 28-31)
- ✅ **cart: Id con referencia a Carts** - Implementado (línea 32-35)
  - Tipo: `mongoose.Schema.Types.ObjectId`
  - Referencia: `ref: "carts"`
- ✅ **role: String (valor por defecto: 'user')** - Implementado (línea 20-23)

**Estado:** ✅ **CUMPLE** - Todos los campos requeridos están presentes.

---

## 2. ENCRIPTACIÓN DE CONTRASEÑA

**Archivo:** `src/utils.js` (función `createHash`)

### Requisitos:
- ✅ **Paquete bcrypt instalado** - Verificado en `package.json`
- ⚠️ **Uso de bcrypt.hashSync** - **PARCIAL**
  - **Consigna dice:** "utilizar el método hashSync"
  - **Implementación actual:** Se usa `bcrypt.hashSync()` dentro de `createHash()` (línea 13)
  - **Observación:** Funcionalmente correcto, pero la consigna pide usar `hashSync` directamente
  - **Recomendación:** Verificar si usar directamente `bcrypt.hashSync()` o si el wrapper es aceptable

- ✅ **Contraseña almacenada de forma segura** - Implementado correctamente
  - En `passport.config.js` línea 31: `password: createHash(password)`
  - La contraseña nunca se almacena en texto plano

**Estado:** ⚠️ **PARCIAL** - Funciona correctamente, pero no usa `hashSync` directamente como especifica la consigna.

---

## 3. ESTRATEGIAS DE PASSPORT

**Archivo:** `src/config/passport.config.js`

### Requisitos:
- ✅ **Estrategias desarrolladas para el modelo User** - Implementado
  - Estrategia "register" (línea 12-43)
  - Estrategia "login" (línea 47-77)
  - Estrategia "github" (línea 123-160)
  - Estrategia "jwt" (línea 79-99)
  - Estrategia "current" (línea 102-121)

- ✅ **Estrategias correctamente configuradas** - Implementado
  - Usan `userModel` para consultas
  - Validan credenciales correctamente
  - Usan `passport-jwt` para autenticación JWT

- ✅ **Estrategia para autenticación mediante JWT** - **IMPLEMENTADA**
  - Estrategia "jwt" configurada (línea 79-99)
  - Usa `JwtStrategy` de `passport-jwt`
  - Extrae token del header `Authorization: Bearer <token>`
  - Valida token y busca usuario en base de datos
  - `passport-jwt` instalado en `package.json` (línea 26)

**Estado:** ✅ **CUMPLE** - Todas las estrategias requeridas están implementadas, incluyendo JWT.

---

## 4. SISTEMA DE LOGIN Y GENERACIÓN DE TOKEN JWT

**Archivos:** `src/controllers/session.controllers.js`, `src/routes/session.router.js`, `src/utils.js`

### Requisitos:
- ✅ **Sistema de login permite autenticarse** - Implementado
  - Ruta: `POST /api/sessions/login` (línea 11 de `session.router.js`)
  - Usa estrategia "login" de Passport (línea 11 de `session.controllers.js`)

- ✅ **Generación de token JWT válido** - **IMPLEMENTADO**
  - El `loginController` genera token JWT usando `generateToken()` (línea 22)
  - Retorna token en formato JSON (línea 33-37)
  - Usa `{ session: false }` para trabajar con JWT en lugar de sesiones (línea 12)
  - El token incluye: id, email, role (definido en `utils.js` línea 22-25)
  - Expira en 24 horas (línea 28 de `utils.js`)

- ✅ **Token JWT puede utilizarse para acciones protegidas** - **IMPLEMENTADO**
  - Estrategia "jwt" en Passport valida tokens (línea 79-99 de `passport.config.js`)
  - Estrategia "current" permite usar JWT para obtener usuario actual
  - El token se envía en header: `Authorization: Bearer <token>`
  - Las estrategias extraen y validan el token automáticamente

**Estado:** ✅ **CUMPLE** - El login genera JWT y el token puede usarse para acciones protegidas.

---

## 5. ESTRATEGIA "CURRENT" Y ENDPOINT /api/sessions/current

### 5.1. Estrategia "current"
**Archivo:** `src/config/passport.config.js`

- ✅ **Estrategia "current" implementada** - **IMPLEMENTADA**
  - Estrategia "current" configurada (línea 102-121)
  - Usa `JwtStrategy` de `passport-jwt`
  - Extrae token del header `Authorization: Bearer <token>`

- ✅ **Extrae usuario asociado al token JWT** - **IMPLEMENTADO**
  - Valida el token JWT usando `JWT_SECRET`
  - Busca usuario en base de datos usando `payload.id` (línea 111)
  - Retorna el usuario completo si existe

- ✅ **Maneja errores de token inválido o inexistente** - **IMPLEMENTADO**
  - Si el usuario no existe, retorna error (línea 112-114)
  - Si hay error en la validación, retorna mensaje "Token inválido o expirado" (línea 117)
  - Maneja errores con try-catch (línea 109-118)

### 5.2. Endpoint /api/sessions/current
**Archivo:** `src/routes/session.router.js`

- ⚠️ **Ruta /api/sessions/current existe** - **PARCIAL**
  - El controlador `currentController` existe en `src/controllers/current.controller.js`
  - **FALTA:** Agregar la ruta en `session.router.js`
  - **FALTA:** Mover `currentController` a `session.controllers.js` (recomendado)

- ⚠️ **Valida usuario logueado** - **PARCIAL**
  - El controlador está implementado y usa la estrategia "current"
  - **FALTA:** Agregar la ruta para que sea accesible

- ⚠️ **Devuelve datos del usuario asociado al token JWT** - **PARCIAL**
  - El controlador retorna datos del usuario sin password (línea 21-28 de `current.controller.js`)
  - **FALTA:** Agregar la ruta para que funcione

- ✅ **Validación precisa y segura** - **IMPLEMENTADO**
  - Usa Passport con estrategia "current" para validar JWT
  - Maneja errores apropiadamente (línea 6-18 de `current.controller.js`)

**Estado:** ⚠️ **PARCIAL** - La estrategia "current" está implementada y el controlador existe, pero falta agregar la ruta en el router.

---

## RESUMEN POR CRITERIO DE EVALUACIÓN

### ✅ CUMPLE COMPLETAMENTE
1. **Modelo de Usuario** - Todos los campos requeridos están presentes
2. **Encriptación de Contraseña** - Funciona correctamente usando `bcrypt.hashSync()`
3. **Estrategias de Passport** - Todas las estrategias implementadas (register, login, github, jwt, current)
4. **Estrategia JWT de Passport** - Implementada usando `passport-jwt`
5. **Sistema de Login con JWT** - El login genera y retorna token JWT válido
6. **Uso de Token en Rutas Protegidas** - Las estrategias JWT permiten usar tokens para autenticación
7. **Estrategia "current"** - Implementada y configurada correctamente

### ⚠️ PARCIAL / PENDIENTE
1. **Endpoint /api/sessions/current** - El controlador existe pero falta agregar la ruta en el router

---

## TAREAS PENDIENTES (Orden de Prioridad)

### Prioridad Alta (Requisitos Obligatorios):
1. ⚠️ Mover `currentController` de `current.controller.js` a `session.controllers.js` (recomendado para mantener todo junto)
2. ❌ Agregar ruta `GET /api/sessions/current` en `session.router.js`
3. ❌ Actualizar import en `session.router.js` para incluir `currentController` desde `session.controllers`
4. ❌ Eliminar archivo `current.controller.js` después de mover el código

### Nota sobre Cart:
- ✅ El campo `cart` está correctamente implementado como referencia
- La consigna NO requiere crear el modelo Cart, solo la referencia en User
- Si el modelo Cart no existe aún, la referencia funcionará cuando se cree

---

## ARCHIVOS QUE REQUIEREN MODIFICACIÓN

1. **src/controllers/session.controllers.js** - Agregar `currentController` (mover desde `current.controller.js`)
2. **src/routes/session.router.js** - Agregar import de `currentController` y ruta `GET /current`
3. **src/controllers/current.controller.js** - Eliminar después de mover el código

## ARCHIVOS CON CÓDIGO ÚTIL EXISTENTE

- **src/utils.js** - Contiene `generateToken()` y `verifyToken()` (listas para usar)
- **package.json** - Tiene `jsonwebtoken` instalado

---

**Estado General del Proyecto:** ⚠️ **CASI COMPLETO** - Solo falta agregar la ruta `/api/sessions/current` en el router. Todo lo demás está implementado correctamente.

**Progreso:** 4/5 criterios principales cumplidos completamente. Solo falta completar el endpoint `/current`.
