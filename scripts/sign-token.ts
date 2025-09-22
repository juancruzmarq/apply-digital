import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const token = jwt.sign(
  {
    svc: 'reports',
  },
  process.env.JWT_SECRET!,
  {
    expiresIn: '30d',
  },
);

console.log(token);
