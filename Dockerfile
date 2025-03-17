# 🏗 Use official Node.js image
FROM node:18

# 🏗 Set working directory inside the container
WORKDIR /app

# 🏗 Copy package.json and package-lock.json (if available)
COPY package*.json ./

# 🏗 Install dependencies
RUN npm install

# 🏗 Copy all source files
COPY . .

# 🏗 Expose port 5000 for the API
EXPOSE 5000

# 🏗 Start the app
CMD ["npm", "run", "dev"]
