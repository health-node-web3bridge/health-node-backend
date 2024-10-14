import Joi from 'joi';

export const configValidationSchema = Joi.object({
    PORT: Joi.number().port().default(3003),
    PINATA_GATEWAY_URL: Joi.string().required(),
    PINATA_SECRET: Joi.string().required(),
    PINATA_JWT: Joi.string().required(),
    IPFS_CLIENT: Joi.string().optional(),
    ENCRYPTION_ALGORITHM: Joi.string().optional(),
    SECRET_KEY: Joi.string().optional(),
});
