# Microservices Platform for User & Product Management

_A Service Oriented Architecture Final Project_

**Course:** SOA915NCC  •  **Date:** August 3, 2025  •  **Author:** Thomas Le (170949218)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features & Innovation](#features--innovation)
3. [Architecture & Design](#architecture--design)
   - [System Context](#system-context)
   - [Sequence Diagrams](#sequence-diagrams)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Docker Compose Setup](#docker-compose-setup)
   - [Kubernetes Deployment](#kubernetes-deployment)
5. [Running Tests](#running-tests)
   - [Unit Tests](#unit-tests)
   - [Integration Tests](#integration-tests)
   - [End-to-End Tests](#end-to-end-tests)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Directory Structure](#directory-structure)
8. [Configuration & Secrets](#configuration--secrets)
9. [Contributing](#contributing)
10. [License](#license)

---

## Project Overview

This repository contains a microservices-based platform enabling users to register, authenticate, and manage product listings. It consists of three independent services:

- **web-interface**: React frontend (served on port 80)
- **user-service**: Node.js + Express backend with MongoDB (port 3000)
- **product-service**: Node.js + Express backend with MongoDB (port 3001)

Each service runs in its own container, communicates via REST, and uses dedicated MongoDB databases for data isolation.

## Features & Innovation

1. **Event-Driven Cascade Delete** via RabbitMQ: When a user deletes their account, a `user.deleted` event triggers the product-service to remove all their products asynchronously.
2. **Inter-Service Authentication**: Separate JWT secrets for user-facing tokens and service-to-service tokens, ensuring strict trust boundaries.
3. **Two-Tier API Rate Limiting**:
   - **Ingress-Level** limits (NGINX Ingress) to mitigate volumetric bursts
   - **Service-Level** middleware rate limiting per user to protect individual APIs
4. **Security Best Practices**: non-root containers, secrets via Kubernetes Secrets or Docker secrets, minimal base images.
5. **Observability**: Prometheus & Grafana for metrics, Loki for centralized logs.

## Architecture & Design

### System Context

- **User Interaction Layer**: React app sends HTTP requests carrying user JWTs.
- **API Layer**: user-service and product-service expose versioned REST endpoints (`/api/v2/users/*`, `/api/v2/products/*`).
- **Persistence Layer**: Two separate MongoDB instances (StatefulSets) with PVCs.
- **Infrastructure**: Kubernetes Ingress, RBAC, NetworkPolicies, RabbitMQ, Helm-managed monitoring stack.

<img width="1127" height="657" alt="Flowchart" src="https://github.com/user-attachments/assets/74e041e5-4eaa-47aa-9ca6-a93051da9c79" />

### Sequence Diagrams

Detailed flows are documented under `docs/sequence-diagrams` (if populated). Key scenarios:
- **Registration & Login**
- **Create & Update Product**
- **User Deletion & Cascade Delete**

<img width="1336" height="2338" alt="Sequence Diagram" src="https://github.com/user-attachments/assets/5c2a288f-a0db-45fd-b059-7ad71d84efa1" />

## Getting Started

### Prerequisites

- **Docker** (v20+) & **Docker Compose**
- **Kubernetes** (minikube or Docker Desktop w/ Kubernetes)
- **kubectl** (v1.33+)
- **Helm** (v3.17+)
- **Node.js** (v18+) & **npm**

### Docker Compose Setup

1. Build and start all services:
   ```bash
   docker compose up --build -d
   ```
2. Verify health:
   ```bash
   docker compose ps
   docker compose logs -f
   ```
3. Access:
   - Frontend: http://localhost
   - User API: http://localhost:3000/health
   - Product API: http://localhost:3001/health

### Kubernetes Deployment

1. Create namespace:
   ```bash
   kubectl create namespace my-services
   ```
2. Install NGINX Ingress:
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
   ```
3. Deploy Metrics Server, Prometheus, Grafana, and Loki via Helm.
4. Apply infrastructure manifests:
   ```bash
   kubectl apply -n my-services -f k8s/configmaps/
   kubectl apply -n my-services -f k8s/secrets/
   kubectl apply -n my-services -f k8s/ingress/
   kubectl apply -n my-services -f k8s/rabbitmq/
   kubectl apply -n my-services -f k8s/rbac/
   kubectl apply -n my-services -f k8s/networking/
   ```
5. Deploy application services:
   ```bash
   kubectl apply -n my-services -f <service-name>/k8s/
   kubectl apply -n my-services -f <service-name>/k8s/hpa/
   kubectl apply -n my-services -f <service-name>/k8s/pvc/
   kubectl apply -n my-services -f <service-name>/k8s/rbac/
   kubectl rollout status deployment -n my-services
   ```
6. Verify pods & services:
   ```bash
   kubectl get all -n my-services
   ```

## Running Tests

### Unit Tests

For each service:
```bash
cd user-service && npm test
cd product-service && npm test
```

### Integration Tests

Start stack via Docker Compose, then:
```bash
npx jest __tests__/integration-create-product.test.js --runInBand
npx jest __tests__/integration-delete-user-products.test.js --runInBand
```

### End-to-End Tests

```bash
npx jest __tests__/user-product-flow.test.js --runInBand
```

## CI/CD Pipeline

GitHub Actions workflows under `.github/workflows`:
- **kubeval.yml**: Validates Kubernetes manifests
- **user-service.yml** & **product-service.yml**: Run unit tests
- **inter-service-test.yml**: Runs integration & E2E tests

All workflows trigger on `push` to `main` or `test` and on pull requests.

## Directory Structure

```
├── user-service
│   ├── __tests__/   # Unit tests
│   ├── k8s/
│   ├── src/
│   └── Dockerfile
├── product-service
│   ├── __tests__/   # Unit tests
│   ├── k8s/
│   ├── src/
│   └── Dockerfile
├── web-interface
│   ├── k8s/
│   ├── src/
│   └── Dockerfile
├── __tests__/      # Integration tests, end-to-end tests
├── k8s/            # Shared manifests
├── .github/workflows
├── docker-compose.yml
└── README.md       # ← You are here
```

## Configuration & Secrets

- Environment variables stored in Kubernetes Config Maps.
- Sensitive keys injected via Docker secrets or Kubernetes Secrets.
- JWT secrets: `USER_JWT_SECRET`, `SERVICE_JWT_SECRET`.
- MongoDB credentials: `MONGO_USER`, `MONGO_PASSWORD`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

Please follow the existing code style and write tests for new functionality.

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/).

You may view and download this code for testing or educational purposes, but you may not modify it, use it commercially, or redistribute it in any form.
