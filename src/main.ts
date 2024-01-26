import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(8000)
  .then(() => {
    console.log("Successfully started on port 8000");
  })
  .catch((error) => {
    console.log(error);
  });
}
bootstrap();
