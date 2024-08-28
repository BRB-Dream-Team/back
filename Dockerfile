# Use an official Node runtime as the parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /back

# Copy the package.json files to the container
COPY package.json ./

# Install app dependencies using npm
RUN npm install -g npm@latest && \
    npm install -g nodemon@latest && \
    npm install

# Copy the rest of the application code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Create a volume for the database
VOLUME /var/lib/postgresql/data

# Run database setup and start the app
# CMD npm run db:setup && npm start
CMD npm run db:setup && npm run dev