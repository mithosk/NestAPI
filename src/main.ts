import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = new DocumentBuilder()
		.setTitle('NestAPI')
		.setDescription('Example of NestJS Web API application')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('/', app, document)

	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	await app.listen(3000)
}

bootstrap()
