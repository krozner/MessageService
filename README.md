# Message service

> Build app containers

```sh
$ docker-compose up -d
```

>Rebuild database schema (src/Resources/Database/Schema/Schema.sql)
```sh
$ bin/app-bash rebuild
```
>Rebuild database with test data fixtures
```sh
$ bin/app-bash rebuild --test
```
>Rebuild database with templates data (src/Resources/Database/EmailTemplates)
```sh
$ bin/app-bash rebuild --templates
```

> Run app
```sh
$ bin/app-bash --dev
```

>Run tests
```sh
$ bin/app-bash test
```

