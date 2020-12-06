// 관게로 엮기 위해 인덱스 만듬
const Comments = require('./comments');
const Posts = require('./posts');
const Users = require('./users');
const Files = require('./files');
const Likes = require('./likes');

// 원투매니 관계를 만들어줌
// setIndex 과정을 자동으로 해주는 것
// constraints : 외래키 만들 떄 제약조건이 생김. 3가지 제약조건이 있는데 가장 많이 쓰는게 cascade, no ation,
Posts.belongsTo(Users, { foreignKey: 'user_id', constraints: false });
Users.hasMany(Posts, { foreignKey: 'user_id', constraints: false });

Posts.hasMany(Files, { foreignKey: 'post_id', constraints: false });
Files.belongsTo(Posts, { foreignKey: 'post_id', constraints: false });

Posts.hasMany(Likes, { foreignKey: 'post_id', constraints: false });
Likes.belongsTo(Posts, { foreignKey: 'post_id', constraints: false });
Likes.belongsTo(Users, { foreignKey: 'post_id', constraints: false });

Posts.hasMany(Comments, { foreignKey: 'post_id', constraints: false });
Comments.belongsTo(Posts, { foreignKey: 'post_id', constraints: false });
Comments.belongsTo(Users, { foreignKey: 'user_id', constraints: false });

module.exports = {
  Users, Posts, Comments,
};

// 유저 123
// 글 456(글쓴이 : 123)

// 유저 123이 삭제되면 (123 pk에 해당하는 행을 삭제)
// 외래키로 연결된 글 456도 같이 삭제 --> cascade
// 해당 글에서 글쓴이 필드가 null이 되는 것 --> setnull
// 아무일도 안 일어남 --> noaction

// 최근에는 별 의미가 없음
// 삭제할 때 실제로 해당 행을 삭제하는 경우가 요즘엔 별로 없음.
