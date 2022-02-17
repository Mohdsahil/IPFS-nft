module.exports = {
  apps: [
    {
      name: 'IPFS',
      script: 'bin/www',
      args: '',
      instances: 1,
      ignore_watch: ['uploads', '.git', 'node_modules', 'nft-metaData.json'],
      autorestart: true,
      watch: true,
      max_memory_restart: '3G',
      env_local: {
        NODE_ENV: 'local',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      env_client: {
        NODE_ENV: 'client',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
