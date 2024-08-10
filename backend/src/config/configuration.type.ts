import { RedisConfig } from './redis';
import { JwtConfig } from './jwt';

export interface Config extends JwtConfig, RedisConfig {}
