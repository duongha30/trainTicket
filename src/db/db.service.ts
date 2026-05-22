import { Inject, Injectable } from '@nestjs/common';
import type { DbModuleOptions } from './db.module';
import { writeFile, access, readFile } from 'fs/promises';

@Injectable()
export class DbService {
    @Inject('OPTIONS')
    private options: DbModuleOptions;

    async read<T>(): Promise<T> {
        const filePath = this.options.path;
        try {
            await access(filePath);

            const data = await readFile(filePath, { encoding: 'utf-8' });
            return JSON.parse(data) as T;
        } catch (err) {
            if (err.code === 'ENOENT') {
                // file does not exist, return empty array
                return [] as unknown as T;
            }
            throw err; // rethrow other errors
        }
    }

    async write(obj: object) {
        await writeFile(this.options.path, JSON.stringify(obj || []), {
            encoding: 'utf-8',
        });
    }
}
