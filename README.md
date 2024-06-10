# risk-client

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Docker
```
docker build -t mjduffin/risk-client .
docker run -it -p 8081:80 --rm --name risk-client-1 mjduffin/risk-client
```

# Deployment

Run `yarn build` and drop the contents of the `dist` directory into the S3 bucket configured for static website hosting. This can be done easily using the following CLI command:

`aws s3 sync dist/ s3://<bucket-name>/`
