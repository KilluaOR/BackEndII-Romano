# CHECKLIST DE CUMPLIMIENTO - Entrega N°1
## Autenticación y Autorización

---

## 1. MODELO DE USUARIO Y ENCRIPTACIÓN DE CONTRASEÑA

### 1.1. Campos del Modelo User
**Archivo:** `src/dao/models/user.model.js`

- ✅ **first_name: String** - Implementado (línea 7-10)
- ✅ **last_name: String** - Implementado (línea 11-14)
- ✅ **email: String (único)** - Implementado con `unique: true` (línea 15-19)
- ❌ **age: Number** - **NO EXISTE** - Campo requerido ausente
- ✅ **password: String (hash)** - Implementado (línea 24-27)
- ❌ **cart: ObjectId (referencia a Carts)** - **NO EXISTE** - Campo requerido ausente
- ✅ **role: String (default 'user')** - Implementado con valor por defecto (línea 20-23)

**Resumen:** 5/7 campos implementados. Faltan: `age` y `cart`.

---

### 1.2. Encriptación de Contraseña
**Archivo:** `src/utils.js`

- ✅ **Paquete bcrypt instalado** - Verificado en `package.json` (línea 15: `"bcrypt": "^6.0.0"`)
- ⚠️ **Uso de bcrypt.hashSync** - **PARCIAL** - Se usa indirectamente a través de `createHash()` (línea 12-13)
  - La función `createHash()` usa `bcrypt.hashSync(password, bcrypt.genSaltSync(10))`
  - **Observación:** No se usa directamente `bcrypt.hashSync`, sino a través de una función wrapper
- ✅ **Contraseña almacenada de forma segura** - Implementado correctamente
  - En `passport.config.js` línea 31: `password: createHash(password)`
  - La contraseña nunca se almacena en texto plano

**Resumen:** Funcionalmente correcto, pero no usa directamente `bcrypt.hashSync` como especifica la consigna.

---

## 2. ESTRATEGIAS DE PASSPORT PARA AUTENTICACIÓN Y AUTORIZACIÓN

**Archivo:** `src/config/passport.config.js`

### 2.1. Estrategias Configuradas
- ✅ **Estrategia "register"** - Implementada (línea 11-42)
  - Usa LocalStrategy
  - Valida usuario existente
  - Crea nuevo usuario con contraseña hasheada
- ✅ **Estrategia "login"** - Implementada (línea 46-76)
  - Usa LocalStrategy
  - Valida credenciales
  - Verifica contraseña con `isValidPassword()`
- ✅ **Estrategia "github"** - Implementada (línea 79-115)
  - OAuth con GitHub
  - Crea usuario si no existe
- ❌ **Estrategia JWT** - **NO EXISTE**
  - No hay estrategia basada en JWT usando `passport-jwt`
  - Aunque existe `generateToken()` y `verifyToken()` en `utils.js`, no hay estrategia de Passport que los use

### 2.2. Funcionamiento con Modelo User
- ✅ Las estrategias funcionan correctamente con el modelo User
- ✅ Usan `userModel` para consultas a la base de datos

### 2.3. Serialización/Deserialización
- ✅ `serializeUser` implementado (línea 118-120)
- ✅ `deserializeUser` implementado (línea 123-130)

**Resumen:** 3/4 estrategias implementadas. **FALTA la estrategia JWT de Passport.**

---

## 3. SISTEMA DE LOGIN Y GENERACIÓN DE TOKEN JWT

**Archivos:** `src/controllers/session.controllers.js`, `src/routes/session.router.js`, `src/utils.js`

### 3.1. Login de Usuario
- ✅ **Login autentica usuarios correctamente** - Implementado
  - Ruta: `POST /api/sessions/login` (línea 11 de `session.router.js`)
  - Usa estrategia "login" de Passport (línea 10 de `session.controllers.js`)

### 3.2. Generación de Token JWT
- ❌ **El login NO genera un token JWT** - **NO CUMPLE**
  - El login solo usa `passport.authenticate("login")` con redirecciones
  - No se genera ni se devuelve un token JWT al cliente
  - Aunque existe `generateToken()` en `utils.js` (línea 20-30), **NO se usa en el login**

### 3.3. Uso del Token en Rutas Protegidas
- ❌ **El token NO funciona para acceder a acciones protegidas** - **NO CUMPLE**
  - No hay middleware que valide JWT
  - No hay rutas protegidas que usen JWT
  - El sistema actual usa sesiones de Express, no JWT

**Resumen:** El login funciona, pero **NO genera JWT** y **NO permite usar tokens** en rutas protegidas como requiere la consigna.

---

## 4. ESTRATEGIA "CURRENT" Y ENDPOINT /api/sessions/current

### 4.1. Ruta /api/sessions/current
**Archivo:** `src/routes/session.router.js`

- ❌ **La ruta NO existe** - **NO CUMPLE**
  - No hay ruta definida para `/api/sessions/current`
  - Solo existen: `/register`, `/login`, `/github`, `/githubcallback`, `/logout`

### 4.2. Estrategia "current" de Passport
**Archivo:** `src/config/passport.config.js`

- ❌ **Estrategia "current" NO existe** - **NO CUMPLE**
  - No hay ninguna estrategia llamada "current" configurada en Passport

### 4.3. Validación de Usuario Logueado
- ❌ **No valida que el usuario esté logueado** - **NO CUMPLE**
  - No hay implementación que valide JWT

### 4.4. Extracción de Datos desde JWT
- ❌ **No extrae datos del usuario desde el JWT** - **NO CUMPLE**
  - No hay código que decodifique el token JWT

### 4.5. Devolución de Datos del Usuario
- ❌ **No devuelve datos asociados al token** - **NO CUMPLE**
  - No existe el endpoint

### 4.6. Manejo de Errores
- ❌ **No maneja errores de token inválido o inexistente** - **NO CUMPLE**
  - No hay validación de tokens

**Resumen:** **0/6 puntos cumplidos.** La ruta `/api/sessions/current` y la estrategia "current" **NO están implementadas**.

---

## RESUMEN GENERAL

### ✅ CUMPLE COMPLETAMENTE
1. Campos básicos del modelo User (first_name, last_name, email, password, role)
2. Encriptación de contraseñas con bcrypt (aunque indirectamente)
3. Estrategias de Passport para registro y login (LocalStrategy)
4. Sistema de login funcional con autenticación

### ⚠️ PARCIAL / MEJORABLE
1. Uso de `bcrypt.hashSync` (se usa indirectamente a través de wrapper)
2. Estrategias de Passport (faltan JWT y "current")

### ❌ NO CUMPLE
1. **Campos faltantes en modelo User:**
   - `age: Number`
   - `cart: ObjectId` (referencia a Carts)

2. **Estrategia JWT de Passport:**
   - No existe estrategia basada en JWT usando `passport-jwt`

3. **Sistema de Login con JWT:**
   - El login NO genera token JWT
   - No se puede usar el token en rutas protegidas

4. **Ruta /api/sessions/current:**
   - La ruta NO existe
   - No hay estrategia "current"
   - No valida usuario logueado
   - No extrae datos del JWT
   - No devuelve datos del usuario
   - No maneja errores de token

---

## ARCHIVOS RELEVANTES

### Archivos que requieren modificación:
1. `src/dao/models/user.model.js` - Agregar campos `age` y `cart`
2. `src/config/passport.config.js` - Agregar estrategia JWT y estrategia "current"
3. `src/controllers/session.controllers.js` - Modificar login para generar JWT
4. `src/routes/session.router.js` - Agregar ruta `/current`
5. `src/middlewares/auth.js` - (vacío) Crear middleware para validar JWT

### Archivos con código útil existente:
- `src/utils.js` - Contiene `generateToken()` y `verifyToken()` (no se usan actualmente)
- `package.json` - Tiene `jsonwebtoken` instalado

---

## OBSERVACIONES ADICIONALES

### Errores de Seguridad / Malas Prácticas Detectadas:
1. ⚠️ El login actual usa sesiones de Express, no JWT como requiere la consigna
2. ⚠️ No hay validación de tokens JWT en ninguna parte del código
3. ⚠️ El modelo User no tiene el campo `cart` que debería referenciar a un modelo Cart (que tampoco existe)

### Código Existente No Utilizado:
- Las funciones `generateToken()` y `verifyToken()` en `utils.js` están implementadas pero **nunca se usan**
- El paquete `jsonwebtoken` está instalado pero **no se integra con Passport**

---

**Fecha de análisis:** $(date)
**Estado general:** ⚠️ **PARCIAL** - Requiere implementación de JWT y ruta `/current` para cumplir con la consigna completa.
