import { Model, ModelStatic } from 'sequelize';

export const getFromDB = async function (
  property: any,
  model: any
) {
  return await model.findOne({ where: { property } })
};

export const addToDB = async function (
  model: ModelStatic<Model<any, any>>,
  params: any
) {
  return await model.create({ ...params });
};

//ModelStatic<Model<any, any>>