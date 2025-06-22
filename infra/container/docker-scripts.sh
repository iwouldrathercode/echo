#!/bin/bash

# Docker management script for AdonisJS v6 React Starter Kit
# Run this script from the infra/container/ directory

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if we're in the right directory
check_directory() {
    if [ ! -f "docker-compose.yml" ] || [ ! -f "docker-compose.dev.yml" ]; then
        print_error "Please run this script from the infra/container/ directory"
        exit 1
    fi
}

# Function to start development environment
start_dev() {
    print_header "Starting Development Environment"
    check_docker
    check_directory
    print_status "Building and starting development services..."
    docker-compose -f docker-compose.dev.yml up --build -d
    print_status "Development environment started!"
    print_status "Access your application at:"
    echo "  - Web App: http://localhost:8080"
    echo "  - SurrealDB: http://localhost:8000"
    echo "  - Direct App: http://localhost:3333"
}

# Function to start production environment
start_prod() {
    print_header "Starting Production Environment"
    check_docker
    check_directory
    print_status "Building and starting production services..."
    docker-compose up --build -d
    print_status "Production environment started!"
    print_status "Access your application at:"
    echo "  - Web App: http://localhost"
    echo "  - SurrealDB: http://localhost:8000"
    echo "  - Direct App: http://localhost:3333"
}

# Function to stop all services
stop_services() {
    print_header "Stopping Services"
    check_docker
    check_directory
    print_status "Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_status "All services stopped!"
}

# Function to view logs
view_logs() {
    local service=${1:-web}
    print_header "Viewing Logs for $service"
    check_docker
    check_directory
    print_status "Showing logs for $service (Press Ctrl+C to exit)..."
    docker-compose logs -f $service
}

# Function to rebuild services
rebuild() {
    local service=${1:-all}
    print_header "Rebuilding Services"
    check_docker
    check_directory
    if [ "$service" = "all" ]; then
        print_status "Rebuilding all services..."
        docker-compose build --no-cache
        docker-compose -f docker-compose.dev.yml build --no-cache
    else
        print_status "Rebuilding $service service..."
        docker-compose build --no-cache $service
        docker-compose -f docker-compose.dev.yml build --no-cache $service
    fi
    print_status "Rebuild complete!"
}

# Function to clean up
cleanup() {
    print_header "Cleaning Up"
    check_docker
    check_directory
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker-compose down -v --remove-orphans
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        print_status "Cleanup complete!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show status
show_status() {
    print_header "Service Status"
    check_docker
    check_directory
    print_status "Production services:"
    docker-compose ps
    echo
    print_status "Development services:"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to execute commands in containers
exec_command() {
    local service=${1:-web}
    local command=${2:-bash}
    print_header "Executing Command in $service"
    check_docker
    check_directory
    print_status "Running '$command' in $service container..."
    docker-compose exec $service $command
}

# Function to show help
show_help() {
    print_header "Docker Management Script"
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo
    echo "Commands:"
    echo "  dev           Start development environment"
    echo "  prod          Start production environment"
    echo "  stop          Stop all services"
    echo "  logs [SERVICE] View logs (default: web)"
    echo "  rebuild [SERVICE] Rebuild services (default: all)"
    echo "  cleanup       Remove all containers, networks, and volumes"
    echo "  status        Show service status"
    echo "  exec [SERVICE] [COMMAND] Execute command in container"
    echo "  help          Show this help message"
    echo
    echo "Examples:"
    echo "  $0 dev                    # Start development environment"
    echo "  $0 logs nginx            # View nginx logs"
    echo "  $0 exec web npm test     # Run tests in web container"
    echo "  $0 rebuild web           # Rebuild only web service"
    echo
    echo "Note: Run this script from the infra/container/ directory"
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_services
        ;;
    "logs")
        view_logs $2
        ;;
    "rebuild")
        rebuild $2
        ;;
    "cleanup")
        cleanup
        ;;
    "status")
        show_status
        ;;
    "exec")
        exec_command $2 $3
        ;;
    "help"|*)
        show_help
        ;;
esac