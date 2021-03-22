import { Logger as LoggerInterface, QueryRunner } from 'typeorm';

import logger from './Logger';

const dbLogger = logger.child({ name: 'TypeORM' });

export class TypeORMLogger implements LoggerInterface {
	logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
		dbLogger.debug('Running query:');
		dbLogger.debug({
			query: query,
			parameters: parameters,
			queryRunner: queryRunner,
		});
	}

	logQueryError(
		error: string | Error,
		query: string,
		parameters?: any[],
		queryRunner?: QueryRunner
	): void {
		dbLogger.debug('Query has encountered an error:');
		dbLogger.debug({
			error: error.toString(),
			query: query,
			parameters: parameters,
			queryRunner: queryRunner,
		});
	}

	logQuerySlow(
		time: number,
		query: string,
		parameters?: any[],
		queryRunner?: QueryRunner
	): void {
		dbLogger.debug('Query has been flagged as slow:');
		dbLogger.debug({
			time: time,
			query: query,
			parameters: parameters,
			queryRunner: queryRunner,
		});
	}

	logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
		dbLogger.debug('Schema has been built:');
		dbLogger.debug({ message: message, queryRunner: queryRunner });
	}

	logMigration(message: string, queryRunner?: QueryRunner): void {
		dbLogger.debug('Migration has been run:');
		dbLogger.debug({ message: message, queryRunner: queryRunner });
	}

	log(
		level: 'log' | 'info' | 'warn',
		message: any,
		queryRunner?: QueryRunner
	): void {
		if (level === 'log' || level === 'info') {
			logger.debug({ message: message, queryRunner: queryRunner });
		} else {
			logger.warn({ message: message, queryRunner: queryRunner });
		}
	}
}
