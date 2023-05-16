import { Model, ModelStatic } from 'sequelize';

const getFromDB = async function (property: any, model: any) {
  return await model.findOne({ where: { property } });
};

const addToDB = async function (
  model: ModelStatic<Model<any, any>>,
  params: any
) {
  return await model.create({ ...params });
};

export { getFromDB, addToDB };

//ModelStatic<Model<any, any>>
