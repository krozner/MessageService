module.exports = {
  apps : [
    {
      name: "App",
      script: "./bin/www",
      watch: false,
      env: {
        "PORT": 8000,
        "NODE_ENV": "development"
      },
      env_production: {
        "PORT": 80,
        "NODE_ENV": "production"
      }
    }
  ]
};
