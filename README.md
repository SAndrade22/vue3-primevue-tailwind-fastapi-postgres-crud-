# Vue 3 + PrimeVue + TailwindCSS + Pinia + FastAPI + PostgreSQL - CRUD

Este proyecto es un sistema **CRUD profesional** con un frontend moderno y un backend escalable.  
Diseñado para ser rápido, modular y fácil de mantener.

---

## 🚀 Tecnologías utilizadas

### **Frontend**
- [Vue 3](https://vuejs.org/) (Composition API + TypeScript)
- [PrimeVue](https://primevue.org/) (componentes UI)
- [TailwindCSS](https://tailwindcss.com/) (estilos)
- [Pinia](https://pinia.vuejs.org/) (store management)
- [Axios](https://axios-http.com/) (peticiones HTTP)
- Vuelidate (validaciones)
- PrimeFlex (layout helpers)

### **Backend**
- [FastAPI](https://fastapi.tiangolo.com/) (framework Python)
- [PostgreSQL](https://www.postgresql.org/) (base de datos)
- SQLAlchemy (ORM)
- Pydantic (validaciones)
- Uvicorn (servidor ASGI)

---

## 📂 Estructura del Proyecto

.
├── backend/                # API con FastAPI
│   ├── main.py              # Entrada principal
│   ├── database.py          # Configuración DB
│   ├── models/              # Modelos ORM
│   ├── schemas/             # Esquemas Pydantic
│   ├── crud/                # Operaciones CRUD
│   └── routers/             # Rutas API
│
├── frontend/               # Aplicación Vue 3
│   ├── src/
│   │   ├── components/      # Componentes
│   │   ├── views/           # Páginas
│   │   ├── stores/          # Pinia stores
│   │   ├── router/          # Rutas
│   │   └── main.ts          # Entrada principal
│
└── README.md

---

## ⚙️ Instalación y Configuración

### **1️⃣ Clonar repositorio**
```bash
git clone https://github.com/USUARIO/NOMBRE-REPO.git
cd NOMBRE-REPO
```

---

### **2️⃣ Backend (FastAPI + PostgreSQL)**

1. Entrar al backend:
```bash
cd backend
```

2. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar variables de entorno `.env`:
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/tu_base
```

5. Iniciar servidor:
```bash
uvicorn main:app --reload
```
El backend estará en: **http://localhost:8000**

---

### **3️⃣ Frontend (Vue 3)**

1. Entrar al frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```
El frontend estará en: **http://localhost:5173**

---

## 🗄️ Scripts útiles

### **Backend**
```bash
# Ejecutar backend
uvicorn main:app --reload
# Instalar paquete nuevo
pip install paquete
# Congelar dependencias
pip freeze > requirements.txt
```

### **Frontend**
```bash
# Ejecutar frontend
npm run dev
# Compilar para producción
npm run build
# Linter/Format
npm run lint
```

---

## 📌 Funcionalidades

✅ CRUD completo (crear, leer, actualizar, eliminar)  
✅ Gestión de clientes con paginación  
✅ Filtros y búsqueda global  
✅ Etiquetas dinámicas por cliente  
✅ Activar/Inactivar en lote  
✅ Exportar datos a CSV  
✅ Confirmaciones antes de eliminar  
✅ Diseño responsive y moderno con TailwindCSS  
✅ Alerta visual (Toast) en acciones importantes  

---

---

## 📄 Licencia
Este proyecto está bajo la licencia MIT.  
¡Siéntete libre de usarlo y mejorarlo!
