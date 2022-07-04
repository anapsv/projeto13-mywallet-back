import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {db} from '../dbStrategy/mongo.js';
import joi from 'joi';

export async function registerUser(req, res) {
  const body = req.body;
  console.log(body);
  
  if(req.body.password!==req.body.confirmPassword){
    return res.sendStatus(422);
  }
  const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const user = {
    name: body.name,
    email: body.email,
    password: body.password
  }
  
  const { error } = userSchema.validate(user);

  if (error) {
    return res.sendStatus(422);
  }

  const encryptedPassword = bcrypt.hashSync(user.password, 10);

  await db.collection('users').insertOne({ ...user, password: encryptedPassword});
  res.status(201).send('Usuário criado com sucesso');
}

export async function loginUser(req, res) {
  const user = req.body;

  const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  });

  const { error } = userSchema.validate(user);

  if (error) {
    return res.sendStatus(422);
  }

  const userdb = await db.collection('users').findOne({ email: user.email });

  if (userdb && bcrypt.compareSync(user.password, userdb.password)) {
    const token = uuid();

    await db.collection('sessions').insertOne({
      token,
      userId: userdb._id
    });
    const name=userdb.name;
    return res.status(201).send({ token, name});
  } else {
    return res.status(401).send('Senha ou email incorretos!');
  }
}