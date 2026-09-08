import passport from passport;

import User from "../models/user.model.js"

import {
  Strategy as JwtStrategy,
  ExtractJwt
} from "passport-jwt";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}

passport.use(
    "register",
    new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    async (
        req,
        email,
        password,
        done
    ) => {
        try{
            const {
                first_name,
                last_name
            } = req.body

            if(
                !first_name ||
                !last_name ||
                !email ||
                !password
            ){
                return done(
                    null,
                    false,
                    {
                        message: "Todos los campos son obligatorios"
                    }
                )
    

            }
             const newUser =
          await userService.registerUser({
            first_name,
            last_name,
            email,
            password
          });


        return done(
          null,
          newUser
        );

      } catch (error) {

        if (
          error.code ===
          "EMAIL_EXISTS"
        ) {

          return done(
            null,
            false,
            {
              message:
                "El email ya está registrado"
            }
          );

        }

        return done(error);
      }

    }
  )
);


passport.use(
    "login",

    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (
            email,
            password,
            done
        ) => {
            try {
                const normalizedEmail = email.trim().toLowerCase();
            
                const user = await UserDao.getUserByEmail(normalizedEmail);
            
            if(!user){

                return done(
                    null,
                    false,
                    {message: "Credenciales inválidas"}
                );
            }
            const validPassword = await isValidPassword(password, user.password);
            
            if (!validPassword){
                return done(
                    null,
                    false,
                    {
                        message: "Credenciales inválidas"
                    }
                )
            }
            return done(
                null,
                user
            )

        } catch(error){
            return done(error)
        }
        }
    )
)

const cookieExtractor = (req) => {

  if (
    req &&
    req.cookies &&
    req.cookies.currentUser
  ) {

    return req.cookies.currentUser;

  }

  return null;
};

passport.use(
  "current",

  new JwtStrategy(
    {

      jwtFromRequest:
        ExtractJwt.fromExtractors([
          cookieExtractor
        ]),

      secretOrKey:
        process.env.JWT_SECRET

    },

    async (
      payload,
      done
    ) => {

      try {

        const user =
          await UserDAO.getUserById(
            payload.id
          );


        if (!user) {

          return done(
            null,
            false
          );

        }


        return done(
          null,
          user
        );

      } catch (error) {

        return done(error);

      }

    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id).select("-password");

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;