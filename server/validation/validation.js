import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const postSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(10).required(),
  category: Joi.string().valid('Technology', 'Travel', 'Food', 'Lifestyle', 'Health', 'Business', 'Other'),
  tags: Joi.array().items(Joi.string()),
  image: Joi.string().uri().allow('')
});

export const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  postId: Joi.string().required()
});