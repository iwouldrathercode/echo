# AdonisJS v6 React Starter Kit with Docker

This project provides a complete Docker setup for running an AdonisJS v6 React starter kit application with SurrealDB and Nginx.

## Project Structure

```
.
├── backend/                 # AdonisJS v6 React starter kit application
│   ├── app/                # Application code
│   ├── config/             # Configuration files
│   ├── resources/          # Frontend resources
│   ├── package.json        # Node.js dependencies
│   └── ...
├── infra/                  # Infrastructure configuration
│   ├── container/          # Docker configuration
│   │   ├── Dockerfile      # Production Docker image
│   │   ├── Dockerfile.dev  # Development Docker image
│   │   ├── docker-compose.yml      # Production services
│   │   ├── docker-compose.dev.yml  # Development services
│   │   ├── docker-scripts.sh       # Management script
│   │   ├── .dockerignore           # Docker build exclusions
│   │   └── nginx/          # Nginx configuration
│   │       ├── nginx.conf         # Main Nginx configuration
│   │       └── conf.d/
│   │           └── default.conf   # Server configuration with wildcard support
│   └── kubernetes/         # Kubernetes configuration (future)
└── README.md              # This file
```

## Architecture

- **Web**: AdonisJS v6 React starter kit application
- **Database**: SurrealDB (NoSQL database)
- **Reverse Proxy**: Nginx for load balancing, SSL termination, and **wildcard subdomain support**

## Prerequisites

- Docker
- Docker Compose
- Node.js 18+ (for local development)

## Quick Start

### Production

1. Navigate to the container directory:
```bash
cd infra/container
```

2. Build and start all services:
```bash
./docker-scripts.sh prod
# or
docker-compose up --build
```

3. Access your application:
   - Web App: http://localhost (or any subdomain)
   - SurrealDB: http://localhost:8000
   - Direct App: http://localhost:3333

### Development

1. Navigate to the container directory:
```bash
cd infra/container
```

2. Start development environment with hot reloading:
```bash
./docker-scripts.sh dev
# or
docker-compose -f docker-compose.dev.yml up --build
```

3. Access your application:
   - Web App: http://localhost:8080 (or any subdomain)
   - SurrealDB: http://localhost:8000
   - Direct App: http://localhost:3333

## Wildcard Subdomain Support

**IMPORTANT**: This setup includes wildcard subdomain support! All subdomains will point to your AdonisJS v6 app's welcome page.

### How it works:
- Any subdomain (e.g., `api.example.com`, `admin.example.com`, `test.example.com`) will be handled by Nginx
- All requests are proxied to the AdonisJS v6 application
- The application receives the original hostname in the `Host` header
- You can access your app via any subdomain you configure in your DNS

### Examples:
- `localhost` → AdonisJS app
- `api.localhost` → AdonisJS app
- `admin.localhost` → AdonisJS app
- `test.localhost` → AdonisJS app
- `anything.localhost` → AdonisJS app

### Configuration:
- Nginx uses a wildcard server block with `server_name ~^.*$;`
- All subdomains are automatically handled
- The original hostname is preserved in headers for your application logic

## Services

### Web Application (AdonisJS v6)
- **Port**: 3333 (internal), 3333 (external)
- **Environment**: Production/Development
- **Features**: React frontend with AdonisJS backend
- **Subdomain Support**: All subdomains point to this application
- **Location**: `backend/` directory

### SurrealDB
- **Port**: 8000
- **Credentials**: root/root
- **Storage**: Persistent volume
- **Mode**: Memory (for development)

### Nginx
- **Port**: 80 (HTTP), 443 (HTTPS - commented out)
- **Features**: Reverse proxy, load balancing, SSL termination, **wildcard subdomain support**
- **Static files**: Served from `/app/public/`
- **Subdomain Handling**: All subdomains are automatically routed to the AdonisJS app
- **Location**: `infra/container/nginx/` directory

## Configuration

### Environment Variables

The following environment variables are available:

- `NODE_ENV`: Environment (production/development)
- `PORT`: Application port (default: 3333)
- `DATABASE_URL`: SurrealDB connection string

### Nginx Configuration

- Main config: `infra/container/nginx/nginx.conf`
- Server config: `infra/container/nginx/conf.d/default.conf` (includes wildcard support)
- SSL certificates: `infra/container/ssl/` directory (create your own)

### SurrealDB Configuration

- Username: `root`
- Password: `root`
- Database: In-memory (development) or file-based (production)

## Development Workflow

1. **Navigate to container directory**:
   ```bash
   cd infra/container
   ```

2. **Start development environment**:
   ```bash
   ./docker-scripts.sh dev
   ```

3. **Make changes to your code** in the `backend/` directory - they will be automatically reflected due to volume mounting

4. **Test subdomains** - access your app via any subdomain (e.g., `api.localhost:8080`)

5. **View logs**:
   ```bash
   ./docker-scripts.sh logs web
   ```

6. **Stop services**:
   ```bash
   ./docker-scripts.sh stop
   ```

## Production Deployment

1. **Navigate to container directory**:
   ```bash
   cd infra/container
   ```

2. **Build and start production services**:
   ```bash
   ./docker-scripts.sh prod
   ```

3. **Set up SSL certificates**:
   - Place your SSL certificates in the `ssl/` directory
   - Uncomment HTTPS configuration in `nginx/conf.d/default.conf`
   - Consider using wildcard SSL certificates for subdomain support

4. **Configure environment variables**:
   - Create a `.env` file in the `backend/` directory with production values
   - Update `docker-compose.yml` with proper environment variables

5. **DNS Configuration**:
   - Point your domain to your server
   - Configure wildcard DNS record (`*.yourdomain.com`) to point to your server
   - All subdomains will automatically work

## Useful Commands

All commands should be run from the `infra/container/` directory:

```bash
# Navigate to container directory
cd infra/container

# Use the management script
./docker-scripts.sh dev          # Start development
./docker-scripts.sh prod         # Start production
./docker-scripts.sh stop         # Stop all services
./docker-scripts.sh logs web     # View web logs
./docker-scripts.sh status       # Show service status
./docker-scripts.sh cleanup      # Clean up everything

# Or use docker-compose directly
docker-compose up --build        # Production
docker-compose -f docker-compose.dev.yml up --build  # Development
docker-compose down              # Stop services
docker-compose logs -f web       # View logs
docker-compose exec web npm test # Run tests
```

## Local Development with Custom Domain

To use `myapp.test` locally:

1. **Edit your `/etc/hosts` file**:
   ```bash
   sudo nano /etc/hosts
   ```
   Add:
   ```
   127.0.0.1 myapp.test *.myapp.test
   ```

2. **Start the development environment**:
   ```bash
   cd infra/container
   ./docker-scripts.sh dev
   ```

3. **Access your app**:
   - http://myapp.test:8080
   - http://api.myapp.test:8080
   - http://admin.myapp.test:8080

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 80, 3333, and 8000 are available
2. **Permission issues**: Run Docker commands with appropriate permissions
3. **Build failures**: Check if all dependencies are properly specified in `backend/package.json`
4. **Subdomain not working**: Check DNS configuration and ensure wildcard records are set up
5. **Wrong directory**: Make sure you're running commands from `infra/container/`

### Logs

View logs for specific services:
```bash
cd infra/container
./docker-scripts.sh logs web
./docker-scripts.sh logs surrealdb
./docker-scripts.sh logs nginx
```

### Database Connection

To connect to SurrealDB directly:
```bash
cd infra/container
docker-compose exec surrealdb surreal sql --conn http://localhost:8000 --user root --pass root
```

### Testing Subdomains

Test wildcard subdomain functionality:
```bash
# Test different subdomains
curl -H "Host: api.localhost" http://localhost:8080
curl -H "Host: admin.localhost" http://localhost:8080
curl -H "Host: test.localhost" http://localhost:8080
```

## Security Notes

- Change default SurrealDB credentials in production
- Set up proper SSL certificates (consider wildcard certificates for subdomains)
- Configure firewall rules
- Use environment variables for sensitive data
- Regularly update Docker images
- Consider rate limiting for subdomains if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in the appropriate directories (`backend/` for app code, `infra/container/` for Docker config)
4. Test with Docker and subdomains
5. Submit a pull request

## License

This project is licensed under the MIT License.