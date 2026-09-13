import mongooseImport from "mongoose";

type MongooseModule = typeof mongooseImport & {
  default?: typeof mongooseImport;
};

const imported = mongooseImport as MongooseModule;

export const mongoose: typeof mongooseImport =
  imported.models ? imported : (imported.default ?? imported);
