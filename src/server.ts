import { serverConfig } from './config';
import { testDbConnection } from './database/db';
import app from './index';

testDbConnection();

app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
});
