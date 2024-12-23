# Node.js'in uygun sürümünü seçiyoruz
FROM node:18

# Çalışma dizini oluşturuyoruz
WORKDIR /app

# package.json ve package-lock.json'ı çalışma dizinine kopyalıyoruz
COPY package*.json ./

# Bağımlılıkları yüklüyoruz
RUN npm install

# Projeyi kopyalıyoruz
COPY . .

# Uygulamayı başlatmak için gerekli komutu ekliyoruz
CMD ["npm", "start"]

# Uygulamanın dinleyeceği portu açıyoruz
EXPOSE 3000
