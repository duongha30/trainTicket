import { Module, DynamicModule } from '@nestjs/common';
import { DbService } from './db.service';

export interface DbModuleOptions {
    path: string;
}

@Module({})
export class DbModule {
    static register(options: DbModuleOptions): DynamicModule { // dynamic module to allow passing options to the module
        return {
            module: DbModule, // mandatory to declare in dynamic modules
            providers: [
                {
                    provide: 'OPTIONS', // declare a provider so that we can inject the options in DbService
                    useValue: options,
                },
                DbService, //  tells NestJS's DI container to instantiate and make it available within DbModule
            ],
            exports: [DbService], // makes DbService visible outside DbModule to any module that imports it (like UserModule)
        };
    }
}
