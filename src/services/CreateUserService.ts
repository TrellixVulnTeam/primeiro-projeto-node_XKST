import { getRepository } from 'typeorm';
import User from '../models/User';
import { hash } from 'bcryptjs';
import AppError from '../errors/AppError';

interface Request{
  name: string;
  email: string;
  password;
}

class CreateUserService{
  public async execute({name, email, password}: Request): Promise<User>{
    const usersRepository = getRepository(User);
    const checkUserExists = await usersRepository.findOne({
      where :{email},
    });

    const hashedPassword = await hash(password, 8);

    if(checkUserExists){
      throw new AppError('Email já utilizado.', 400);
    }
    const user = usersRepository.create({
      name, 
      email, 
      password : hashedPassword,
    })

    await usersRepository.save(user);

    return user;

  };
}

export default CreateUserService;