import Joi from 'joi';

export const configValidationSchema = Joi.object({
    PORT: Joi.number().port().required(),
    PINATA_GATEWAY_URL: Joi.string().required(),
    PINATA_SECRET: Joi.string().required(),
    PINATA_JWT: Joi.string().required(),
    IPFS_CLIENT: Joi.string().optional(),
});
