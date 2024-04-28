import { lazy } from "react";

const Login = lazy(() => import("./Login"));
const SignUp = lazy(() => import("./SignUp"));
const Chats = lazy(() => import("./Chats"));
const Profile = lazy(() => import("./Profile"));
const About = lazy(() => import("./About"));
const Settings = lazy(() => import("./Settings"));
const Users = lazy(() => import("./Users"));
const NotFound = lazy(() => import("./NotFound"));

export { Login, SignUp, Chats, Profile, About, Settings, Users, NotFound };
