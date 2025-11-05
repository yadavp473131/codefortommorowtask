🚀 Features

Register User: Create a new user with name, email, password, and role.
POST /api/auth/register

Login User: Authenticate using email and password; returns a JWT token.
POST /api/auth/login

Forgot Password: Sends a reset password link to the registered email (valid for 5 minutes).
POST /api/auth/forgot

Reset Password: Reset password using a valid token received on email.
POST /api/auth/reset/:token

Token-based Authentication: Protect routes using JWT tokens.

Secure Password Handling: All passwords are hashed before saving.
