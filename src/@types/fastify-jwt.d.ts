import '@fastify/jwt';
// for more details, see https://github.com/fastify/fastify-jwt#typescript-1
declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string,
      role: 'ADMIN' | 'MEMBER',
    }
  }
}