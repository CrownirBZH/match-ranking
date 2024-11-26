import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { CurrentContext } from './modules/current-context';
import { SwaggerService } from './services/swagger.service';

@Controller()
export class AppController {
	@Get()
	@ApiExcludeEndpoint()
	root() {
		return CurrentContext.res.redirect('/documentation.html', 302);
	}

	@Get('swagger.json')
	@ApiExcludeEndpoint()
	swagger() {
		return SwaggerService.doc;
	}
}
