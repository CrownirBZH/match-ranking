import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Admin } from '@prisma/client';
// biome-ignore lint/style/useImportType: <explanation>
import { AdminService } from 'src/services/admin/admin.service';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from 'src/services/auth.service';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard extends AuthGuard<Partial<Admin>> {
	constructor(
		protected readonly adminService: AdminService,
		protected readonly authService: AuthService,
	) {
		super(
			authService,
			(id: string) => adminService.getAdminById(id),
			'Admin token is missing',
			'Admin token is invalid',
			'ADMIN',
		);
	}
}
