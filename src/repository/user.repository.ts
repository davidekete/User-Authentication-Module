import { Model, ModelStatic } from 'sequelize';

const getFromDB = async function (property: any, model: any) {
  return await model.findOne({ where: { property } });
};

const acquireFromDB = async function (model: any, query: any) {
  return await model.findOne({ where: query });
};

const addToDB = async function (
  model: ModelStatic<Model<any, any>>,
  params: any
) {
  return await model.create(params);
};

export { getFromDB, addToDB, acquireFromDB };

//ModelStatic<Model<any, any>>
