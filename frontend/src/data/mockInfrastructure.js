
export const initialContainers = [
  {
    id: "c1",
    name: "devopsflow-frontend",
    image: "devopsflow/frontend:latest",
    status: "running",
    ports: "5173:5173",
  },
  {
    id: "c2",
    name: "devopsflow-backend",
    image: "devopsflow/backend:latest",
    status: "running",
    ports: "5000:5000",
  },
  {
    id: "c3",
    name: "devopsflow-demo",
    image: "devopsflow/demo:latest",
    status: "stopped",
    ports: "8080:80",
  },
];

export const initialDeployments = [
  {
    id: "d1",
    name: "devopsflow-frontend",
    namespace: "default",
    image: "devopsflow/frontend:latest",
    replicas: 3,
    readyReplicas: 3,
    status: "running",
  },
  {
    id: "d2",
    name: "devopsflow-backend",
    namespace: "default",
    image: "devopsflow/backend:latest",
    replicas: 2,
    readyReplicas: 2,
    status: "running",
  },
  {
    id: "d3",
    name: "devopsflow-demo",
    namespace: "development",
    image: "devopsflow/demo:latest",
    replicas: 1,
    readyReplicas: 0,
    status: "pending",
  },
];
