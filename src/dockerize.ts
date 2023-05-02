import * as fs from 'fs';
import * as path from 'path';

export const dockerize = (args: {
  framework: string;
  appName: string;
  imageName: string;
}): void => {
  const { framework, appName, imageName } = args;
  console.log(`Dockerizing ${framework} application "${appName}"...`);

  const dockerfile = generateDockerfile(framework);
  const dockerCompose = generateDockerCompose(imageName);

  fs.writeFileSync(
    path.join(process.cwd(), 'Dockerfile'),
    dockerfile);
  fs.writeFileSync(
    path.join(process.cwd(), 'docker-compose.yml'),
    dockerCompose
  );

  console.log(`Dockerfile and docker-compose.yml have been created.`);
};

// Generate Dockerfile based on the selected framework
const generateDockerfile = (framework: string): string => {
  switch (framework) {
    case 'node':
      return `FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`;
    case 'angular':
      return `FROM node:16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.21
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;
    // ... Add cases for 'react' and 'next'
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
};


// Generate docker-compose.yml
const generateDockerCompose = (imageName: string): string => {
  return `version: '3'
services:
  app:
    build: .
    image: ${imageName}
    ports:
      - '3000:3000'
  `;
};
