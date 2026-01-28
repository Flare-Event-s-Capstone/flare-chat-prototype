// Simple mock authentication service to test password reset

export function requestPasswordReset(username) 
{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(!username || username.trim().length < 3) 
        {
        reject({ message: "Enter a valid username." });
        return;
      }
      resolve({ message: "If an account exists, a reset link was sent." });
    }, 800); 
  });
}