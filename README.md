# ✅ Task Management System

Görev oluşturma, güncelleme, silme, tamamlama ve dosya yükleme işlemlerinin yapılabildiği, loglama ve hatırlatma e-posta sistemleriyle desteklenen tam özellikli bir görev yönetim sistemi.

---

## 📁 Proje Yapısı

```
├── client/               # Vue 3 + Pinia frontend
├── server/               # NestJS backend
│   ├── modules/
│   ├── database/
│   │   ├── knex/         # MySQL yapılandırması
│   │   └── mongo/        # MongoDB yapılandırması
│   └── uploads/          # Yüklenen dosyalar
```

---

## 🚀 Kurulum ve Çalıştırma Adımları

### 1. Depoyu Klonla

```bash
git clone https://github.com/NumanKilincoglu/task-management.git
cd task-management
```

### 2. Backend’i Başlat

```bash
cd server
npm install
npx knex migrate:latest --knexfile knexfile.js (Knex ile MySQL tablolarını oluşturur)
npm run start:dev
```

### 3. Frontend’i Başlat

```bash
cd client
npm install
npm run dev
```

---

## ⚙️ Ortam Değişkenleri (.env)

`server/.env` dosyasına şunları ekleyin:

```env
JWT_SECRET=6v+Ach9c8ip17uItATVeptjlpTdTCKY6w9y/HWrfafE=
REDIS_URL=rediss://red-cn51908l6cac73a8ts80:LaryCMDZg2J5uMJ95m7C0xeaaSiodjli@oregon-keyvalue.render.com:6379
MONGODB_URI=mongodb://localhost:27017/project-logs
PORT=3001
BASE_URL=http://localhost:3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=task_manager
```

---

## Veritabanı Şeması

### MySQL - `tasks` Tablosu

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('low', 'medium', 'high') NOT NULL,
  end_date DATE NOT NULL,
  file_path VARCHAR(255),
  file_name VARCHAR(255),
  attachment_type VARCHAR(255),
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


```

### MySQL - `users` Tablosu

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### MongoDB Koleksiyonları

#### `tasklogs`

```js
{
  taskId: Number,
  userId: Number,
  action: 'created' | 'updated' | 'completed' | 'deleted',
  changes: Object,
  createdBy: String,
  createdAt: Date
}
```

#### `maillogs`

```js
{
  recipient: String,
  subject: String,
  sentAt: Date,
  taskId: Number,
  status: 'sent' | 'failed',
  error: Object
}
```

## 🔁 Özellikler

- 📝 Görev CRUD işlemleri (oluşturma, güncelleme, silme, tamamlama)
- 📁 Dosya yükleme (göreve dosya ekleme)
- 🧠 Redis cache ile görev önbellekleme ve JWT için doğrulama
- 📬 Son tarihi yaklaşan görevler için hatırlatma e-postaları (gerçek gönderim değil, konsola yazdırılır)
- 📜 MongoDB ile görev ve e-posta işlemleri için loglama


## 🖼️ Ekran Görüntüleri

### Anasayfa

![Anasayfa Görüntüsü](./assets/dashboard.PNG)

---

### Görev Oluşturma

![Görev Oluşturma Görüntüsü](./assets/create.png)

---

### Görev Düzenleme

![Görev Oluşturma Görüntüsü](./assets/edit.png)

---

### Görev Detay

![Görev Detay Görüntüsü](./assets/details.png)

---

### Giriş

![Görev Detay Görüntüsü](./assets/login.png)

---

### Kayıt

![Görev Detay Görüntüsü](./assets/register.png)

---