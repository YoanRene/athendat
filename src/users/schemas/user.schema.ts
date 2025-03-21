import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @ApiProperty({ description: 'The username of the user' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: 'The email of the user' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'The password of the user' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ description: 'The full name of the user' })
  @Prop()
  fullName: string;

  @ApiProperty({ description: 'The role of the user' })
  @Prop({ default: 'user' })
  role: string;

  @ApiProperty({ description: 'Whether the user is active' })
  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);