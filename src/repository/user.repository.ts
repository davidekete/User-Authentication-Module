import { Model, ModelStatic } from 'sequelize';
import { CustomError } from '../utils/generateError';

const getFromDB = async function (model: any, query: any) {
  try {
    return await model.findOne({ where: query });
  } catch (error: any) {
    throw new CustomError(error);
  }
};

const addToDB = async function (
  model: ModelStatic<Model<any, any>>,
  params: any
) {
  try {
    return await model.create(params);
  } catch (error: any) {
    throw new CustomError(error);
  }
};

export { getFromDB, addToDB };

//ModelStatic<Model<any, any>>
