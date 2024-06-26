# firebase auth with nextjs template

This is a template for using firebase authentication with nextjs.

<b>this template includes the following features: </b>

- nextjs with typescript
- firebase auth with google provider
- firestore database

<b>How to use this template:</b>

1. clone this repository
2. create a new project in firebase console
3. enable google authentication in firebase console
4. create a new web app in firebase console
5. create .env.local file in the root directory of the project and put the following content in it:

```ts
// client side keys
FIREBASE_API_KEY = "";
FIREBASE_AUTH_DOMAIN = "";
FIREBASE_PROJECT_ID = "";
FIREBASE_STORAGE_BUCKET = "";
FIREBASE_MESSAGING_SENDER_ID = "";
FIREBASE_APP_ID = "";
FIREBASE_MEASUREMENT_ID = "";

// server side keys
FIREBASE_ADMIN_CLIENT_EMAIL = "";
FIREBASE_ADMIN_PRIVATE_KEY = "";
FIREBASE_ADMIN_PROJECT_ID = "";

// these can be found in the firebase console under project settings -> service accounts -> generate new private key install and open it, and you will find the keys in it.
```

all done! check the middleware.ts file theres list called protectedRoutes, add the routes you want to protect with authentication to it.

### Notes:

- use firebase-admin to fetch data in server components and the firebase client sdk to fetch data in client components.
- dont forget to set the rules in firestore to allow only authenticated users to read and write data, heres an example allows only authenticated users to read and write data in the posts collection:

```ts
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read, write: if request.auth != null;
    }
  }
}

```
