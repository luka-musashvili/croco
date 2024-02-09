# Croco book project

სატესტო პროექტი კროკოსთვის

## Getting Started

მიყევით ამ მარტივ ინსტრუქციას

### Prerequisites

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. Clone this repository:

    git clone https://github.com/yourusername/your-project.git

2. Navigate to the project directory:

    cd your-project

3. Create a .env file in the project root with your PostgreSQL configuration:

    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=postgres
    DB_PASSWORD=12321
    DB_PORT=5432

4. Build and start the Docker containers:

    docker-compose up --build

5. Your Koa.js app should now be running at http://localhost:3000.
