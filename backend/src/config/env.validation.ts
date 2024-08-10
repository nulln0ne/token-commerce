import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EnvironmentVariables } from './env.schema';

export const validate = (config: Record<string, unknown>) => {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
};
