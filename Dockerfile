# Step 1: Build the front-end assets
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 
# (Note: if your build outputs to a folder other than 'dist', note it for the next step)

# Step 2: Serve with Nginx
FROM nginx:alpine
# Copy the compiled files from the build step into the Nginx server directory
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80 for Cloud Run
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]