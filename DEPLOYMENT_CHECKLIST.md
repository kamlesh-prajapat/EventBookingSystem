# Deployment Checklist - Event Booking System v2.1

## 📋 Pre-Deployment Verification

### Database Requirements
- [ ] MySQL 8.0+ installed and running
- [ ] Database schema created: `event_system`
- [ ] All tables created (users, events, bookings, etc.)
- [ ] Test data populated (optional but recommended)
- [ ] Backup of current database taken
- [ ] Database credentials stored securely

### Backend Setup
- [ ] pom.xml has all dependencies installed
- [ ] Java 11+ installed and JAVA_HOME configured
- [ ] `application.properties` configured for production
  ```properties
  spring.datasource.url=jdbc:mysql://host:port/event_system
  spring.datasource.username=your_db_user
  spring.datasource.password=your_db_password
  spring.jpa.hibernate.ddl-auto=validate
  spring.profiles.active=production
  ```
- [ ] JWT secret key configured (change from default!)
  ```properties
  jwt.secret=your-super-secret-key-change-this-in-production
  jwt.expiration=86400000
  ```
- [ ] CORS settings updated for production domain
  ```java
  allowedOrigins: "https://your-frontend-domain.com"
  ```
- [ ] `/uploads` directory exists and has write permissions
  ```bash
  mkdir -p /var/www/uploads
  chmod 755 /var/www/uploads
  ```
- [ ] Swagger/API docs secured (disable in production if needed)

### Frontend Setup
- [ ] Node.js 18+ installed
- [ ] npm dependencies installed: `npm install`
- [ ] `.env` file configured for production
  ```
  VITE_API_URL=https://api.yourdomain.com
  ```
- [ ] Build files generated: `npm run build`
  ```bash
  npm run build
  # Creates dist/ folder with production build
  ```
- [ ] Static files optimized (minified, compressed)
- [ ] Environment variables not exposed in frontend code
- [ ] API base URL uses HTTPS for production

### Security Checklist

#### Backend Security
- [ ] JWT secret changed from default
- [ ] CORS properly configured for production domain
- [ ] HTTPS enforced (not development HTTP)
- [ ] SQL injection prevention verified (parameterized queries used)
- [ ] Authentication working (401 returns for invalid tokens)
- [ ] Authorization working (admin endpoints require ADMIN role)
- [ ] File upload validation active:
  - [ ] File size limit enforced (5MB)
  - [ ] File type validation (image/* only)
  - [ ] Malicious file detection
- [ ] Error messages don't expose sensitive info
- [ ] Logging configured properly (no passwords in logs)
- [ ] Database backups configured

#### Frontend Security
- [ ] No API keys in source code
- [ ] No hardcoded secrets
- [ ] XSS protection in place (React's built-in)
- [ ] CSRF tokens used for state-changing operations
- [ ] Token stored securely (localStorage acceptable for this app)
- [ ] Sensitive data not logged to console
- [ ] CSP headers configured on server

### Performance Checklist

- [ ] Database indexes created for frequently queried columns
  ```sql
  CREATE INDEX idx_event_date ON events(eventDate);
  CREATE INDEX idx_user_email ON users(email);
  CREATE INDEX idx_booking_user ON bookings(userId);
  ```
- [ ] Database query optimization verified (no N+1 queries)
- [ ] Frontend build size reasonable
  ```bash
  npm run build -- --report
  # Check dist/ size, should be < 500KB gzipped
  ```
- [ ] Pagination implemented (prevents loading all data at once)
- [ ] Image optimization configured:
  - [ ] File size limits enforced
  - [ ] Automatic compression considered
- [ ] Caching strategy considered (Redis for session if needed)
- [ ] CDN configured for static assets (optional)

---

## 🚀 Deployment Steps

### Step 1: Backend Deployment

#### Option A: Standalone JAR
```bash
# Build the project
mvn clean package -DskipTests

# Deploy JAR file
java -jar eventsystem-0.0.1-SNAPSHOT.jar &

# Or run in background with nohup
nohup java -jar eventsystem-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

#### Option B: Docker (Recommended)
```bash
# Create Dockerfile (if not exists)
docker build -t event-booking-backend:latest .

# Run container
docker run -d \
  --name event-booking-api \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host:port/event_system \
  -e SPRING_DATASOURCE_USERNAME=user \
  -e SPRING_DATASOURCE_PASSWORD=password \
  -v /uploads:/app/uploads \
  event-booking-backend:latest

# Check logs
docker logs -f event-booking-api
```

#### Option C: Application Server (Tomcat)
```bash
# Build WAR file
# (Configure pom.xml to build WAR if using external Tomcat)

# Deploy to Tomcat
cp eventsystem.war /opt/tomcat/webapps/

# Restart Tomcat
sudo systemctl restart tomcat
```

### Step 2: Frontend Deployment

#### Option A: Static Hosting (Vercel, Netlify)
```bash
# Build the project
npm run build

# Deploy dist/ folder to hosting platform
# Vercel: vercel deploy
# Netlify: netlify deploy --prod --dir=dist
```

#### Option B: Nginx Reverse Proxy
```bash
# Build the project
npm run build

# Copy to web directory
sudo cp -r dist/* /var/www/html/

# Configure Nginx
# /etc/nginx/sites-available/default
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/html;
    index index.html;
    
    # SPA routing fix - send all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Reload Nginx
sudo nginx -s reload
```

#### Option C: Docker
```bash
# Build frontend image
docker build -t event-booking-frontend:latest -f Dockerfile.frontend .

# Run container
docker run -d \
  --name event-booking-web \
  -p 3000:80 \
  -e api_base_url=https://api.yourdomain.com \
  event-booking-frontend:latest
```

### Step 3: SSL/HTTPS Setup

#### Using Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Configure Nginx with SSL
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Step 4: Domain & DNS Configuration

- [ ] DNS records updated to point to server IP
  ```
  Type: A
  Name: @
  Value: your.server.ip.address
  
  Type: CNAME
  Name: www
  Value: yourdomain.com
  
  Type: CNAME
  Name: api
  Value: yourdomain.com
  ```

- [ ] SSL certificate installed
- [ ] HTTPS enforced (redirect HTTP to HTTPS)

### Step 5: Monitoring & Logging

#### Backend Logging
```bash
# Check application logs
tail -f /path/to/app.log

# Monitor system resources
top
# or
htop
# or
watch -n 1 'free -h && echo --- && df -h'
```

#### Database Monitoring
```bash
# Check database connections
sudo systemctl status mysql

# Monitor database size
mysql -u root -p -e "SELECT table_name, round(((data_length + index_length) / 1024 / 1024), 2) MB FROM information_schema.TABLES WHERE table_schema='event_system';"
```

#### Frontend Monitoring
```bash
# Check web server status
sudo systemctl status nginx

# Monitor web server logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## ✅ Post-Deployment Verification

### Functionality Tests
- [ ] Backend API running and accessible
  ```bash
  curl https://api.yourdomain.com/events
  # Should return event list
  ```
- [ ] Frontend loaded successfully
  ```bash
  curl https://yourdomain.com
  # Should return HTML
  ```
- [ ] HTTPS working
  ```bash
  curl -I https://yourdomain.com
  # Should show 200 OK with HTTPS
  ```
- [ ] User registration working
- [ ] User login working
- [ ] Event creation working (admin)
- [ ] Image upload working
- [ ] Event deletion working
- [ ] Pagination working
- [ ] Admin access control enforced

### Performance Tests
- [ ] Frontend loads within 3 seconds
  ```bash
  curl -I https://yourdomain.com
  # Check response time
  ```
- [ ] API responds within 500ms
  ```bash
  time curl https://api.yourdomain.com/events
  ```
- [ ] Database queries optimized
- [ ] Image uploads complete within 10 seconds

### Security Tests
- [ ] HTTPS certificate valid
  ```bash
  openssl s_client -connect yourdomain.com:443
  ```
- [ ] Non-admin cannot access admin endpoints
- [ ] Invalid tokens rejected (401 response)
- [ ] File upload validation working
- [ ] CORS headers correct

### Backup & Recovery
- [ ] Database backup automated
  ```bash
  # Backup script (daily)
  mysqldump -u root -p event_system > backup_$(date +%Y%m%d).sql
  ```
- [ ] Backup restoration tested
- [ ] /uploads directory backed up
- [ ] Recovery plan documented

---

## 🚨 Troubleshooting

### Backend Issues

#### Issue: 503 Service Unavailable
**Solution**:
1. Check if backend service is running: `systemctl status yourapp`
2. Check port 8080: `netstat -tlnp | grep 8080`
3. Check logs: `tail -f /var/log/yourapp.log`
4. Restart service: `systemctl restart yourapp`

#### Issue: 401 Unauthorized on all requests
**Solution**:
1. Verify JWT secret configured
2. Check token expiration
3. Verify Authorization header format: `Bearer {token}`
4. Check CORS configuration

#### Issue: Image upload fails (413 Payload Too Large)
**Solution**:
1. Increase server limits in application.properties:
   ```properties
   server.tomcat.max-http-post-size=5242880
   spring.servlet.multipart.max-file-size=5MB
   spring.servlet.multipart.max-request-size=5MB
   ```
2. Restart application
3. Verify /uploads directory permissions

#### Issue: Database connection fails
**Solution**:
1. Verify MySQL is running: `mysql -u root -p`
2. Check connection string in application.properties
3. Verify database exists: `mysql -u root -p -e "USE event_system;"`
4. Check firewall rules for port 3306

### Frontend Issues

#### Issue: "Cannot find module" errors
**Solution**:
1. Reinstall dependencies: `npm install`
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Check Node version: `node --version` (must be 18+)

#### Issue: API requests failing (CORS errors)
**Solution**:
1. Verify VITE_API_URL in .env is correct
2. Check backend CORS configuration
3. Verify backend is accessible: `curl https://api.yourdomain.com`
4. Check browser console for specific error

#### Issue: Build fails or produces large bundle
**Solution**:
1. Analyze bundle: `npm run build -- --report`
2. Check for unused imports
3. Optimize images in public/
4. Review node_modules for unnecessary packages

### Database Issues

#### Issue: Disk space full
**Solution**:
1. Check space: `df -h`
2. Archive old logs: `gzip /var/log/*.log`
3. Check database size: See monitoring query above
4. Delete old backups: `rm /backups/old_backups/*`

#### Issue: Slow queries
**Solution**:
1. Enable query log: `SET GLOBAL slow_query_log = 'ON';`
2. Review slow queries: `/var/lib/mysql/slow.log`
3. Create missing indexes (see database checklist)
4. Optimize table: `OPTIMIZE TABLE events;`

---

## 📊 Production Configuration Examples

### application.properties (Production)
```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://db-server:3306/event_system
spring.datasource.username=app_user
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Logging
logging.level.root=WARN
logging.level.com.kamlesh.eventsystem=INFO
logging.file.name=/var/log/event-booking/app.log

# File Upload
file.upload.max-size=5242880
file.upload.dir=/var/www/uploads

# CORS
cors.allowed-origins=${CORS_ORIGINS}

# Performance
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

### .env (Production Frontend)
```
VITE_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### nginx.conf (Production)
```nginx
upstream backend {
    server localhost:8080;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    root /var/www/html;
    index index.html;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
}
```

---

## 📈 Performance Optimization Tips

### Backend
1. **Caching**: Use Redis for session/token caching
2. **Database**: Add indexes, enable slow query log
3. **Connection Pool**: Configure HikariCP settings
4. **Compression**: Enable GZIP for API responses
5. **Asyncronous Processing**: Use CompletableFuture for heavy operations

### Frontend
1. **Code Splitting**: Lazy load components
2. **Asset Optimization**: Minify, compress images
3. **Caching**: Implement service workers
4. **CDN**: Serve static assets from CDN
5. **Bundle Analysis**: Monitor bundle size

---

## ✔️ Final Deployment Checklist

- [ ] All tests passed
- [ ] Database backups created
- [ ] Notifications configured (optional)
- [ ] Monitoring set up
- [ ] Incident response plan documented
- [ ] Team trained on deployment & rollback
- [ ] Documentation updated
- [ ] Release notes prepared
- [ ] Stakeholders informed
- [ ] Go/No-Go decision made

**Deployment Date**: ___________________
**Deployed By**: ___________________
**Verified By**: ___________________
**Status**: ✅ DEPLOYED / ❌ BLOCKED

---

## 📞 Support Contacts

- **DevOps/Infrastructure**: ___________________
- **Backend Support**: ___________________
- **Frontend Support**: ___________________
- **Database Support**: ___________________
- **Emergency Contact**: ___________________

---

**Last Updated**: January 2025
**Version**: 2.1
**Environment**: Production
