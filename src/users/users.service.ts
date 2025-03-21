import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WebsocketsGateway } from '../websockets/websockets.gateway';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private websocketsGateway: WebsocketsGateway,
  ) {}

  async create(createUserDto: CreateUserDto, authenticatedUser?: string): Promise<User> {
    this.logger.log(`Creating user with username: ${createUserDto.username}`);
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Create the user with hashed password
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    
    const savedUser = await createdUser.save();
    
    // Emit websocket event with authenticated user if available
    this.websocketsGateway.emitUserOperation(
      authenticatedUser || 'Sistema',
      'creación',
    );
    
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Finding all users');
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    this.logger.log(`Finding user with id: ${id}`);
    const user = await this.userModel.findById(id).exec();
    
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    this.logger.log(`Finding user with username: ${username}`);
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, authenticatedUser?: string): Promise<User> {
    this.logger.log(`Updating user with id: ${id}`);
    
    // If password is provided, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    
    if (!updatedUser) {
      this.logger.warn(`User with id ${id} not found for update`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    // Emit websocket event with authenticated user if available
    this.websocketsGateway.emitUserOperation(
      authenticatedUser || 'Sistema',
      'actualización',
    );
    
    return updatedUser;
  }

  async remove(id: string, authenticatedUser?: string): Promise<User> {
    this.logger.log(`Removing user with id: ${id}`);
    
    const user = await this.userModel.findById(id).exec();
    
    if (!user) {
      this.logger.warn(`User with id ${id} not found for removal`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    
    // Emit websocket event with authenticated user if available
    this.websocketsGateway.emitUserOperation(
      authenticatedUser || 'Sistema',
      'eliminación',
    );
    
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return deletedUser;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    this.logger.log(`Validating user: ${username}`);
    
    const user = await this.userModel.findOne({ username }).exec();
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }
}