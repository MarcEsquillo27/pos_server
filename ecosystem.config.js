require('dotenv').config();

module.exports = {
    apps: [
      {
        name: 'my-app',                // Name of the application
        script: './api/app.js', // Path to the script to execute
        instances: 1,                  // Number of instances to start
        autorestart: true,             // Auto restart if the process crashes
        watch: false,                  // Watch files and restart on changes
        max_memory_restart: '1G',      // Restart if memory usage exceeds 1GB
        env: {
          NODE_ENV: 'development',
          JWT_SECRET: process.env.secret_key
        },
        env_production: {
          NODE_ENV: 'production',
          JWT_SECRET: process.env.secret_key
        }
      }
    ]
  };
  