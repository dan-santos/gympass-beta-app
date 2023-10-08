export class UserAlreadyExistsError extends Error{
  constructor() {
    super('Email already exists');
  }
}

export class InvalidCredentialsError extends Error{
  constructor() {
    super('Credentials are invalid');
  }
}