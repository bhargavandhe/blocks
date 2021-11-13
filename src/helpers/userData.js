import { getUserData } from "./database";

// const currentUID = "999957786577";
const currentUID = localStorage.getItem("uid");
export const userData = getUserData(currentUID);
