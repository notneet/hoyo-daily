module.exports = {
  apps: [
    {
      name: 'bot-daily-checkin-genshin',
      script: 'dist/main.js',
      watch: ['./dist'],
      autorestart: true,
      interpreter: 'node@16.18.0',
    }
  ],
};

