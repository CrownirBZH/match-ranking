import { type INestApplication, Injectable } from '@nestjs/common';
import {
	DocumentBuilder,
	type OpenAPIObject,
	SwaggerModule,
} from '@nestjs/swagger';

const { APP_TITLE, APP_VERSION, APP_DESCRIPTION } = process.env;

@Injectable()
export class SwaggerService {
	private static _doc: OpenAPIObject;

	static setup(app: INestApplication) {
		const options = new DocumentBuilder()
			.setTitle(APP_TITLE)
			.setVersion(APP_VERSION)
			.setDescription(APP_DESCRIPTION)
			.build();

		SwaggerService._doc = SwaggerModule.createDocument(app, options);
	}

	static get doc() {
		return SwaggerService._doc;
	}
}
