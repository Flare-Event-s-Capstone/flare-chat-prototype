# Step 1: Build the front-end assets
FROM node:22.22.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build 
# (Note: if your build outputs to a folder other than 'dist', note it for the next step)

# Step 2: Serve with Nginx
FROM nginx:alpine
# Copy the compiled files from the build step into the Nginx server directory
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 for Cloud Run
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]