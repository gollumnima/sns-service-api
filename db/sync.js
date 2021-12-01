require('dotenv').config();

const bcrypt = require('bcrypt');
const sequelize = require('./connection');
const models = require('../models');
// 절대 프로덕션 모드에서 하면 안됨!
const init = (model, data = []) => model.bulkCreate(data);
// sequelize가 모델링 후의 시점에서 관여하게끔!
// models는 models 폴더의 index.js에서 export 하는 부분

const sync = async () => {
  try {
    console.log('sync...');
    await sequelize.sync({ force: true });
    // return process.exit(0);
    // server.js에서 db.sync({ force: true})와 같음
    await init(models.Users, [{
      username: 'test1',
      password: await bcrypt.hash('1234', 10),
      name: 'testname1',
      description: '테스트하는 유저1입니다',
      status: 'PUBLIC',
      created_at: '2020-10-02 09:00:00',
      image_url: 'https://cdn.pixabay.com/photo/2019/11/13/12/37/dessert-4623573_960_720.jpg',
    }, {
      username: 'test2',
      password: await bcrypt.hash('5678', 10),
      name: 'testname2',
      description: '테스트하는 유저2입니다',
      status: 'PRIVATE',
      created_at: '2020-10-02 10:00:00',
      image_url: 'https://cdn.pixabay.com/photo/2016/12/15/03/27/cocoa-1908020_960_720.jpg',
    }]);
    await init(models.Posts, [
      {
        content: '보건 보건교사다',
        user_id: '1',
        created_at: '2020-10-02 11:00:00',
        updated_at: Date.now(),
        status: 'PUBLISHED',
      },
      {
        content: '나는 안은영 나를 아느냐',
        user_id: '2',
        created_at: '2020-10-02 11:10:00',
        updated_at: Date.now(),
        status: 'PUBLISHED',

      },
      {
        content: '보건교사다 잽싸게 도망가자 ',
        user_id: '1',
        created_at: '2020-10-03 11:00:00',
        updated_at: Date.now(),
        status: 'PUBLISHED',
      },
    ]);
    await init(models.Comments, [
      {
        post_id: 3,
        user_id: 1,
        content: '신난다 댓글이다~~~',
        created_at: '2020-10-04 09:00:00',
        updated_at: Date.now(),
      }, {
        post_id: 3,
        user_id: 2,
        content: '신난다 룰루랄라~~~~',
        created_at: '2020-10-04 12:00:00',
        updated_at: Date.now(),
      }, {
        post_id: 1,
        user_id: 2,
        content: '오예~~~~~~',
        created_at: '2020-10-05 11:00:00',
        updated_at: Date.now(),
      }, {
        post_id: 2,
        user_id: 1,
        content: '밥먹자~~~~~',
        created_at: '2020-10-06 11:00:00',
        updated_at: Date.now(),
      },
    ]);
    console.log('sync finish');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

sync();
