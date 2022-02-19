# Tshirt selling E-commerce Backend API

API for online tshirt ecommerce store.

It has custome features like:

- Custome Authentication (signup, signin, authentication, signout)
- stores password encrypted by Crypto function
- makes use of virtual field
- jsonwebtoken for token generation
- express-jwt for validating tokens
- Role based access (admin, customer)
- creating product, category, orders

## Technologies

- [x] Nodejs
- [x] Expressjs
- [x] MongoDB

## API Reference

### Login `POST /api/signin`

Requires a JSON body specifying:

- `email` string
- `password` string
  ex:

```js
{
    email:"temp@temp.com",
    password:"Password"
}
```

returns JSON if `success`

```js
{
    "token",
    user: { "_id", "name", "email", "role" },
}
```
