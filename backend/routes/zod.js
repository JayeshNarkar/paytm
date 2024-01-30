const zod = require("zod");

const signupBody = zod.object({
  username: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

const updateBody = zod.object({
  username: zod
    .string()
    .min(5)
    .max(15)
    .regex(/^[a-zA-Z0-9]+$/),
  firstName: zod
    .string()
    .min(3)
    .regex(/^[a-zA-Z]+$/)
    .max(15),
  lastName: zod
    .string()
    .regex(/^[a-zA-Z]+$/)
    .max(15),
  password: zod.string().min(8).max(20),
});

module.exports = { signupBody, signinBody, updateBody };
