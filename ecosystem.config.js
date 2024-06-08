module.exports = {
    apps: [
      {
        name: 'my-app',
        script: './api/app.js',
        instances: 2, // Scales up the app to use 2 instances
        exec_mode: 'cluster', // Cluster mode for load balancing
        autorestart: true,
        watch: true,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'development',
          JWT_SECRET: process.env.secret_key,
          OTHER_ENV_VAR: 'value'
        },
        env_production: {
          NODE_ENV: 'production',
          JWT_SECRET: process.env.secret_key,
          OTHER_ENV_VAR: 'value'
        }
      }
    ]
  };
  