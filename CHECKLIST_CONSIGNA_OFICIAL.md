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
  - Estrategia "register" (línea 11-42)
  - Estrategia "login" (línea 46-76)
  - Estrategia "github" (línea 79-115)

- ✅ **Estrategias correctamente configuradas** - Implementado
  - Usan `userModel` para consultas
  - Validan credenciales correctamente
  - Serialización/Deserialización configuradas (línea 118-130)

- ❌ **Estrategia para autenticación mediante JWT** - **NO EXISTE**
  - No hay estrategia de Passport basada en JWT
  - No se usa `passport-jwt`
  - Aunque existe `generateToken()` y `verifyToken()` en `utils.js`, no hay estrategia de Passport que los use

**Estado:** ⚠️ **PARCIAL** - Faltan estrategias JWT de Passport.

---

## 4. SISTEMA DE LOGIN Y GENERACIÓN DE TOKEN JWT

**Archivos:** `src/controllers/session.controllers.js`, `src/routes/session.router.js`, `src/utils.js`

### Requisitos:
- ✅ **Sistema de login permite autenticarse** - Implementado
  - Ruta: `POST /api/sessions/login` (línea 11 de `session.router.js`)
  - Usa estrategia "login" de Passport (línea 10 de `session.controllers.js`)

- ❌ **Generación de token JWT válido** - **NO CUMPLE**
  - El login actual usa redirecciones HTML (`successRedirect`, `failureRedirect`)
  - No genera ni devuelve token JWT al cliente
  - Aunque existe `generateToken()` en `utils.js` (línea 20-30), **NO se usa en el login**

- ❌ **Token JWT puede utilizarse para acciones protegidas** - **NO CUMPLE**
  - No hay middleware que valide JWT
  - No hay rutas protegidas que usen JWT
  - El sistema actual usa sesiones de Express, no JWT

**Estado:** ❌ **NO CUMPLE** - El login funciona pero no genera JWT ni permite usar tokens.

---

## 5. ESTRATEGIA "CURRENT" Y ENDPOINT /api/sessions/current

### 5.1. Estrategia "current"
**Archivo:** `src/config/passport.config.js`

- ❌ **Estrategia "current" implementada** - **NO EXISTE**
  - No hay estrategia llamada "current" configurada en Passport

- ❌ **Extrae usuario asociado al token JWT** - **NO CUMPLE**
  - No hay código que valide JWT y extraiga usuario

- ❌ **Maneja errores de token inválido o inexistente** - **NO CUMPLE**
  - No hay validación de tokens

### 5.2. Endpoint /api/sessions/current
**Archivo:** `src/routes/session.router.js`

- ❌ **Ruta /api/sessions/current existe** - **NO EXISTE**
  - No hay ruta definida para `/current`
  - Solo existen: `/register`, `/login`, `/github`, `/githubcallback`, `/logout`

- ❌ **Valida usuario logueado** - **NO CUMPLE**
  - No existe el endpoint

- ❌ **Devuelve datos del usuario asociado al token JWT** - **NO CUMPLE**
  - No existe el endpoint

- ❌ **Validación precisa y segura** - **NO CUMPLE**
  - No hay implementación

**Estado:** ❌ **NO CUMPLE** - La estrategia "current" y el endpoint `/api/sessions/current` no están implementados.

---

## RESUMEN POR CRITERIO DE EVALUACIÓN

### ✅ CUMPLE COMPLETAMENTE
1. **Modelo de Usuario** - Todos los campos requeridos están presentes
2. **Encriptación de Contraseña** - Funciona correctamente (aunque usa wrapper)

### ⚠️ PARCIAL / MEJORABLE
1. **Uso directo de bcrypt.hashSync** - Se usa indirectamente a través de wrapper
2. **Estrategias de Passport** - Existen estrategias básicas, pero falta JWT

### ❌ NO CUMPLE
1. **Estrategia JWT de Passport** - No existe estrategia basada en JWT usando `passport-jwt`
2. **Sistema de Login con JWT** - El login NO genera token JWT
3. **Uso de Token en Rutas Protegidas** - No se puede usar el token para acciones protegidas
4. **Estrategia "current"** - No existe estrategia "current" de Passport
5. **Endpoint /api/sessions/current** - La ruta NO existe y no devuelve datos del usuario

---

## TAREAS PENDIENTES (Orden de Prioridad)

### Prioridad Alta (Requisitos Obligatorios):
1. ❌ Instalar `passport-jwt` en `package.json`
2. ❌ Crear estrategia JWT en `passport.config.js` usando `passport-jwt`
3. ❌ Crear estrategia "current" en `passport.config.js`
4. ❌ Modificar `loginController` para generar y retornar JWT en formato JSON
5. ❌ Crear `currentController` en `session.controllers.js`
6. ❌ Agregar ruta `GET /api/sessions/current` en `session.router.js`

### Prioridad Media (Mejoras):
7. ⚠️ Considerar usar `bcrypt.hashSync()` directamente en lugar de wrapper (opcional, depende del criterio del evaluador)

### Nota sobre Cart:
- ✅ El campo `cart` está correctamente implementado como referencia
- La consigna NO requiere crear el modelo Cart, solo la referencia en User
- Si el modelo Cart no existe aún, la referencia funcionará cuando se cree

---

## ARCHIVOS QUE REQUIEREN MODIFICACIÓN

1. **package.json** - Agregar `passport-jwt`
2. **src/config/passport.config.js** - Agregar estrategias JWT y "current"
3. **src/controllers/session.controllers.js** - Modificar login y agregar currentController
4. **src/routes/session.router.js** - Agregar ruta `/current`

## ARCHIVOS CON CÓDIGO ÚTIL EXISTENTE

- **src/utils.js** - Contiene `generateToken()` y `verifyToken()` (listas para usar)
- **package.json** - Tiene `jsonwebtoken` instalado

---

**Estado General del Proyecto:** ⚠️ **PARCIAL** - Requiere implementación de JWT y ruta `/current` para cumplir completamente con la consigna.

**Progreso:** 2/5 criterios principales cumplidos completamente.
