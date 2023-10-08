export class MaxDistanceError extends Error{
  constructor() {
    super('Max distance reached');
  }
}

export class MaxNumberOfCheckInsError extends Error{
  constructor() {
    super('Max number of checkins reached');
  }
}

export class LateCheckInValitadionError extends Error{
  constructor() {
    super('The check-in can only be validated until 20 minutes of its creation');
  }
}